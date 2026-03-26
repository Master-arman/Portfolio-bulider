const Portfolio = require('../models/Portfolio');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.savePortfolio = async (req, res) => {
    try {
        const {
            fullName, professionalTitle, location, email, phone, bio, profilePicUrl,
            github, linkedin, twitter, website,
            skills, projects, education, experience, certifications, template
        } = req.body;

        const portfolioData = {
            fullName,
            professionalTitle,
            location,
            email,
            phone,
            bio,
            profilePicUrl,
            github,
            linkedin,
            twitter,
            website,
            skills,
            projects,
            education,
            experience: experience || [],
            certifications: certifications || [],
            template: template || 'minimal'
        };

        // Find the first (and only) portfolio or create one
        let portfolio = await Portfolio.findOne();
        
        let savedPortfolio;
        let created = false;

        if (portfolio) {
            // UPDATE the existing one
            await portfolio.update(portfolioData);
            savedPortfolio = portfolio;
            console.log(`✅ Portfolio UPDATED (id: ${savedPortfolio.id})`);
        } else {
            // CREATE the very first one
            savedPortfolio = await Portfolio.create(portfolioData);
            created = true;
            console.log(`✅ Portfolio CREATED (id: ${savedPortfolio.id})`);
        }
        
        res.status(200).json({ 
            message: created ? "Portfolio created successfully" : "Portfolio updated successfully",
            portfolio: savedPortfolio
        });

    } catch (err) {
        console.error("Save Portfolio Error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.getPortfolio = async (req, res) => {
    try {
        // Just return the first portfolio found
        const portfolio = await Portfolio.findOne();
        
        if (!portfolio) {
            return res.status(404).json({ error: "No portfolio found" });
        }
        
        res.status(200).json(portfolio);
    } catch (err) {
        console.error("Get Portfolio Error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        // Find the first portfolio
        const portfolio = await Portfolio.findOne();
        
        if (!portfolio) {
             return res.status(404).json({ error: "No portfolio found to delete" });
        }
        
        const portfolioId = portfolio.id;
        
        // Delete from database
        await portfolio.destroy();
        
        console.log(`✅ Portfolio ${portfolioId} deleted from DB`);
        res.status(200).json({ message: "Portfolio deleted successfully" });
    } catch (err) {
        console.error("Delete Portfolio Error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded" });
        }
        res.status(200).json({ profilePicUrl: req.file.path });
    } catch (err) {
         console.error("Upload Pic Error:", err);
         res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.downloadPdf = async (req, res) => {
    try {
        // Just find the single portfolio
        const portfolio = await Portfolio.findOne();
        
        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found" });
        }
        
        const doc = new PDFDocument({ margin: 50 });
        const filename = `${portfolio.fullName ? portfolio.fullName.replace(/\s+/g, '_') : 'Portfolio'}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Header Title
        doc.fontSize(24).font('Helvetica-Bold').text(portfolio.fullName || 'User Portfolio', { align: 'center' });
        doc.fontSize(14).font('Helvetica-Oblique').text(portfolio.professionalTitle || '', { align: 'center' });
        doc.moveDown();
        
        // Contact Info
        doc.fontSize(12).font('Helvetica').text(`Email: ${portfolio.email || 'N/A'}`);
        doc.text(`Phone: ${portfolio.phone || 'N/A'}`);
        doc.text(`Location: ${portfolio.location || 'N/A'}`);
        
        if (portfolio.website || portfolio.github || portfolio.linkedin || portfolio.twitter) {
            doc.moveDown(0.5);
            doc.text(`Links: ${portfolio.website || ''} ${portfolio.github || ''} ${portfolio.linkedin || ''} ${portfolio.twitter || ''}`);
        }
        doc.moveDown();

        // Bio section
        if (portfolio.bio) {
             doc.fontSize(16).font('Helvetica-Bold').text('Biography');
             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
             doc.moveDown(0.5);
             doc.fontSize(12).font('Helvetica').text(portfolio.bio);
             doc.moveDown();
        }

        // Skills Section
        const skills = portfolio.skills || [];
        if (skills.length > 0) {
             doc.fontSize(16).font('Helvetica-Bold').text('Skills');
             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
             doc.moveDown(0.5);
             
             skills.forEach(skill => {
                 let skillText = typeof skill === 'object' ? (skill.name || JSON.stringify(skill)) : skill;
                 doc.fontSize(12).font('Helvetica').text(`• ${skillText}`);
             });
             doc.moveDown();
        }

        // Experience Section
        const experience = portfolio.experience || [];
        if (experience.length > 0) {
             doc.fontSize(16).font('Helvetica-Bold').text('Experience');
             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
             doc.moveDown(0.5);
             
             experience.forEach(exp => {
                 const role = exp.role || exp.title || 'Role';
                 const company = exp.company || '';
                 const duration = exp.duration || '';
                 doc.fontSize(14).font('Helvetica-Bold').text(`${role} at ${company}`);
                 if (duration) doc.fontSize(11).font('Helvetica-Oblique').text(duration);
                 if (exp.description) doc.fontSize(12).font('Helvetica').text(exp.description);
                 doc.moveDown(0.5);
             });
             doc.moveDown();
        }

        // Projects Section
        const projects = portfolio.projects || [];
        if (projects.length > 0) {
             doc.fontSize(16).font('Helvetica-Bold').text('Projects');
             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
             doc.moveDown(0.5);
             
             projects.forEach(proj => {
                 const title = proj.title || proj.name || 'Untitled';
                 const desc = proj.description || '';
                 doc.fontSize(14).font('Helvetica-Bold').text(title);
                 if (desc) doc.fontSize(12).font('Helvetica').text(desc);
                 doc.moveDown(0.5);
             });
             doc.moveDown();
        }
        
        // Education Section
        const education = portfolio.education || [];
        if (education.length > 0) {
             doc.fontSize(16).font('Helvetica-Bold').text('Education');
             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
             doc.moveDown(0.5);
             
             education.forEach(edu => {
                 const school = edu.school || edu.institution || 'School';
                 const degree = edu.degree || edu.course || '';
                 doc.fontSize(14).font('Helvetica-Bold').text(school);
                 if (degree) doc.fontSize(12).font('Helvetica').text(degree);
                 doc.moveDown(0.5);
             });
        }

        // Certifications Section
        const certifications = portfolio.certifications || [];
        if (certifications.length > 0) {
             doc.moveDown();
             doc.fontSize(16).font('Helvetica-Bold').text('Certifications');
             doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
             doc.moveDown(0.5);
             
             certifications.forEach(cert => {
                 doc.fontSize(14).font('Helvetica-Bold').text(cert.name || cert.title || 'Certificate');
                 if (cert.issuer) doc.fontSize(12).font('Helvetica').text(`Issued by: ${cert.issuer}`);
                 if (cert.year) doc.fontSize(11).font('Helvetica-Oblique').text(`Year: ${cert.year}`);
                 doc.moveDown(0.5);
             });
        }

        doc.end();

    } catch (err) {
         console.error("PDF Generation Error:", err);
         if (!res.headersSent) {
             res.status(500).json({ error: "Server error generating PDF", details: err.message });
         }
    }
};
