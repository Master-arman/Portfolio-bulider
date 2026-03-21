const Portfolio = require('../models/Portfolio');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.savePortfolio = async (req, res) => {
    try {
        const {
            userId, fullName, professionalTitle, location, email, phone, bio, profilePicUrl,
            github, linkedin, twitter, website,
            skills, projects, education, experience, certifications, template
        } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        // --- Save user data into a unique folder ---
        const safeName = fullName ? fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'user';
        const folderName = `${safeName}_${userId}`;
        const userFolderPath = path.join(__dirname, '..', 'user_data', folderName);

        // Ensure the directory exists
        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true });
        }

        // Write user data to a JSON file in their folder
        const userDataFile = path.join(userFolderPath, 'portfolio_data.json');
        fs.writeFileSync(userDataFile, JSON.stringify(req.body, null, 2));
        // -------------------------------------------

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

        // Explicitly check if portfolio already exists for this userId
        const existingPortfolio = await Portfolio.findOne({ where: { userId } });
        
        let savedPortfolio;
        let created = false;

        if (existingPortfolio) {
            // UPDATE existing portfolio — don't create a new one!
            await Portfolio.update(portfolioData, { where: { userId } });
            savedPortfolio = await Portfolio.findOne({ where: { userId } });
            console.log(`✅ Portfolio UPDATED for userId: ${userId} (id: ${savedPortfolio.id})`);
        } else {
            // CREATE new portfolio only if none exists for this userId
            savedPortfolio = await Portfolio.create({ userId, ...portfolioData });
            created = true;
            console.log(`✅ Portfolio CREATED for userId: ${userId} (id: ${savedPortfolio.id})`);
        }
        
        res.status(200).json({ 
            message: created ? "Portfolio created successfully" : "Portfolio updated successfully",
            portfolio: savedPortfolio,
            folderPath: userFolderPath
        });

    } catch (err) {
        console.error("Save Portfolio Error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.getPortfolio = async (req, res) => {
    try {
        const { userId } = req.params;
        const portfolio = await Portfolio.findOne({ where: { userId } });
        
        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found for this user" });
        }
        
        res.status(200).json(portfolio);
    } catch (err) {
        console.error("Get Portfolio Error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try finding by primary key ID first
        let portfolio = await Portfolio.findByPk(id);
        
        // If not found by PK, try by userId (in case frontend sends userId)
        if (!portfolio) {
            portfolio = await Portfolio.findOne({ where: { userId: id } });
        }
        
        if (!portfolio) {
             return res.status(404).json({ error: "Portfolio not found" });
        }
        
        const portfolioId = portfolio.id;
        const portfolioUserId = portfolio.userId;
        
        // Delete from database
        await Portfolio.destroy({ where: { id: portfolioId } });
        
        // Delete generated physical folder
        const safeName = portfolio.fullName ? portfolio.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'user';
        const folderName = `${safeName}_${portfolioUserId}`;
        const userFolderPath = path.join(__dirname, '..', 'user_data', folderName);
        
        if (fs.existsSync(userFolderPath)) {
            fs.rmSync(userFolderPath, { recursive: true, force: true });
        }
        
        console.log(`✅ Portfolio ${portfolioId} deleted from DB and folder cleaned`);
        res.status(200).json({ message: "Portfolio and physical folder deleted successfully" });
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
        const { id } = req.params;
        
        // Try by PK first, then by userId
        let portfolio = await Portfolio.findByPk(id);
        if (!portfolio) {
            portfolio = await Portfolio.findOne({ where: { userId: id } });
        }
        
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
