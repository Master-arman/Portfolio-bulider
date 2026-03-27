const { Portfolio, Skill, Project, Education, Experience, Certification } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Helper: replace all child records (delete old, create new)
async function replaceAssociated(portfolio, Model, alias, items = []) {
    await Model.destroy({ where: { portfolioId: portfolio.id } });
    if (items && items.length > 0) {
        const rows = items.map(item => ({ ...item, portfolioId: portfolio.id }));
        await Model.bulkCreate(rows);
    }
}

// Include config for eager loading
const PORTFOLIO_INCLUDE = [
    { model: Skill, as: 'skills', attributes: { exclude: ['portfolioId'] } },
    { model: Project, as: 'projects', attributes: { exclude: ['portfolioId'] } },
    { model: Education, as: 'education', attributes: { exclude: ['portfolioId'] } },
    { model: Experience, as: 'experience', attributes: { exclude: ['portfolioId'] } },
    { model: Certification, as: 'certifications', attributes: { exclude: ['portfolioId'] } },
];

exports.savePortfolio = async (req, res) => {
    try {
        const {
            fullName, professionalTitle, location, email, phone, bio, profilePicUrl,
            github, linkedin, twitter, website, template,
            skills, projects, education, experience, certifications
        } = req.body;

        const portfolioData = {
            fullName, professionalTitle, location, email, phone, bio,
            profilePicUrl, github, linkedin, twitter, website,
            template: template || 'minimal',
        };

        // Find first portfolio or create one
        let portfolio = await Portfolio.findOne();
        let created = false;

        if (portfolio) {
            await portfolio.update(portfolioData);
        } else {
            portfolio = await Portfolio.create(portfolioData);
            created = true;
        }

        // Replace all normalized child records (map frontend field names → DB column names)
        await replaceAssociated(portfolio, Skill, 'skills',
            (skills || []).map(s => typeof s === 'string' ? { name: s } : { name: s.name || s })
        );
        await replaceAssociated(portfolio, Project, 'projects',
            (projects || []).map(p => ({
                title: p.title || p.name || 'Untitled',
                description: p.description || null,
                image_url: p.image_url || p.image || null,
                github_link: p.github_link || p.link || null,
                live_link: p.live_link || null,
            }))
        );
        await replaceAssociated(portfolio, Education, 'education',
            (education || []).map(e => ({
                school: e.school || e.institution || null,
                degree: e.degree || null,
                field: e.field || null,
                startYear: e.startYear || e.year || null,
                endYear: e.endYear || null,
            }))
        );
        await replaceAssociated(portfolio, Experience, 'experience',
            (experience || []).map(e => ({
                role: e.role || null,
                company: e.company || null,
                duration: e.duration || null,
                description: e.description || null,
            }))
        );
        await replaceAssociated(portfolio, Certification, 'certifications',
            (certifications || []).map(c => ({
                name: c.name || c.title || null,
                issuer: c.issuer || null,
                year: c.year || null,
            }))
        );

        // Re-fetch with associations
        const savedPortfolio = await Portfolio.findOne({
            where: { id: portfolio.id },
            include: PORTFOLIO_INCLUDE,
        });

        console.log(`✅ Portfolio ${created ? 'CREATED' : 'UPDATED'} (id: ${portfolio.id})`);
        res.status(200).json({
            message: created ? 'Portfolio created successfully' : 'Portfolio updated successfully',
            portfolio: savedPortfolio,
        });

    } catch (err) {
        console.error('Save Portfolio Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ include: PORTFOLIO_INCLUDE });

        if (!portfolio) {
            return res.status(404).json({ error: 'No portfolio found' });
        }

        res.status(200).json(portfolio);
    } catch (err) {
        console.error('Get Portfolio Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne();

        if (!portfolio) {
            return res.status(404).json({ error: 'No portfolio found to delete' });
        }

        const portfolioId = portfolio.id;
        await portfolio.destroy(); // CASCADE deletes child rows

        console.log(`✅ Portfolio ${portfolioId} deleted from DB`);
        res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (err) {
        console.error('Delete Portfolio Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        res.status(200).json({ profilePicUrl: req.file.path });
    } catch (err) {
        console.error('Upload Pic Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.downloadPdf = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ include: PORTFOLIO_INCLUDE });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        const doc = new PDFDocument({ margin: 50 });
        const filename = `${portfolio.fullName ? portfolio.fullName.replace(/\s+/g, '_') : 'Portfolio'}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        // Header
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

        // Bio
        if (portfolio.bio) {
            doc.fontSize(16).font('Helvetica-Bold').text('Biography');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica').text(portfolio.bio);
            doc.moveDown();
        }

        // Skills
        const skills = portfolio.skills || [];
        if (skills.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('Skills');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            skills.forEach(skill => {
                doc.fontSize(12).font('Helvetica').text(`• ${skill.name || skill}`);
            });
            doc.moveDown();
        }

        // Experience
        const experience = portfolio.experience || [];
        if (experience.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('Experience');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            experience.forEach(exp => {
                doc.fontSize(14).font('Helvetica-Bold').text(`${exp.role || 'Role'} at ${exp.company || ''}`);
                if (exp.duration) doc.fontSize(11).font('Helvetica-Oblique').text(exp.duration);
                if (exp.description) doc.fontSize(12).font('Helvetica').text(exp.description);
                doc.moveDown(0.5);
            });
            doc.moveDown();
        }

        // Projects
        const projects = portfolio.projects || [];
        if (projects.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('Projects');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            projects.forEach(proj => {
                doc.fontSize(14).font('Helvetica-Bold').text(proj.title || 'Untitled');
                if (proj.description) doc.fontSize(12).font('Helvetica').text(proj.description);
                doc.moveDown(0.5);
            });
            doc.moveDown();
        }

        // Education
        const education = portfolio.education || [];
        if (education.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('Education');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            education.forEach(edu => {
                doc.fontSize(14).font('Helvetica-Bold').text(edu.school || 'School');
                if (edu.degree) doc.fontSize(12).font('Helvetica').text(edu.degree);
                doc.moveDown(0.5);
            });
        }

        // Certifications
        const certifications = portfolio.certifications || [];
        if (certifications.length > 0) {
            doc.moveDown();
            doc.fontSize(16).font('Helvetica-Bold').text('Certifications');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            certifications.forEach(cert => {
                doc.fontSize(14).font('Helvetica-Bold').text(cert.name || 'Certificate');
                if (cert.issuer) doc.fontSize(12).font('Helvetica').text(`Issued by: ${cert.issuer}`);
                if (cert.year) doc.fontSize(11).font('Helvetica-Oblique').text(`Year: ${cert.year}`);
                doc.moveDown(0.5);
            });
        }

        doc.end();

    } catch (err) {
        console.error('PDF Generation Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Server error generating PDF', details: err.message });
        }
    }
};
