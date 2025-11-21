/**
 * Email template generator
 * Provides customizable cold email templates for reaching out to professors
 */

/**
 * Generate a professional cold email template
 */
const generateColdEmail = (professorName, studentName, studentBackground, researchInterest, professorResearch) => {
    return {
        subject: `Research Opportunity Inquiry - ${researchInterest}`,
        body: `Dear Professor ${professorName},

I hope this email finds you well. My name is ${studentName}, and I am writing to express my strong interest in your research on ${professorResearch}.

${studentBackground}

I am particularly fascinated by your work in this area and would be honored to discuss potential research opportunities in your lab. I believe my background and interests align well with your research objectives.

Would you be available for a brief meeting to discuss potential opportunities? I am happy to work around your schedule.

Thank you for considering my request. I look forward to hearing from you.

Best regards,
${studentName}`
    };
};

/**
 * Generate a follow-up email template
 */
const generateFollowUpEmail = (professorName, studentName, daysSinceLastEmail) => {
    return {
        subject: `Following Up - Research Opportunity Inquiry`,
        body: `Dear Professor ${professorName},

I hope this email finds you well. I wanted to follow up on my previous email from ${daysSinceLastEmail} days ago regarding potential research opportunities in your lab.

I understand you have a busy schedule, and I wanted to reiterate my strong interest in your research. If you have any availability in the coming weeks, I would greatly appreciate the opportunity to discuss this further.

Thank you for your time and consideration.

Best regards,
${studentName}`
    };
};

/**
 * Generate a thank you email template
 */
const generateThankYouEmail = (professorName, studentName, meetingContext) => {
    return {
        subject: `Thank You - ${meetingContext}`,
        body: `Dear Professor ${professorName},

Thank you so much for taking the time to meet with me ${meetingContext}. I greatly appreciated the opportunity to learn more about your research and discuss potential opportunities.

Our conversation has further strengthened my interest in your work, and I am very excited about the possibility of contributing to your research.

Please let me know if there are any next steps or additional information you need from me.

Thank you again for your time and consideration.

Best regards,
${studentName}`
    };
};

/**
 * Generate a custom email with variable substitution
 */
const generateCustomEmail = (template, variables) => {
    let subject = template.subject;
    let body = template.body;

    // Replace all variables in the format {{variable_name}}
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, variables[key]);
        body = body.replace(regex, variables[key]);
    });

    return { subject, body };
};

/**
 * Get all available template types
 */
const getTemplateTypes = () => {
    return [
        {
            type: 'cold_email',
            name: 'Cold Email',
            description: 'Initial outreach to a professor',
            requiredFields: ['professorName', 'studentName', 'studentBackground', 'researchInterest', 'professorResearch']
        },
        {
            type: 'follow_up',
            name: 'Follow-Up Email',
            description: 'Follow up on a previous email',
            requiredFields: ['professorName', 'studentName', 'daysSinceLastEmail']
        },
        {
            type: 'thank_you',
            name: 'Thank You Email',
            description: 'Thank you after a meeting or interview',
            requiredFields: ['professorName', 'studentName', 'meetingContext']
        },
        {
            type: 'custom',
            name: 'Custom Template',
            description: 'Custom email with variable substitution',
            requiredFields: ['template', 'variables']
        }
    ];
};

/**
 * Generate email based on template type
 */
const generateEmailByType = (type, data) => {
    switch (type) {
        case 'cold_email':
            return generateColdEmail(
                data.professorName,
                data.studentName,
                data.studentBackground,
                data.researchInterest,
                data.professorResearch
            );

        case 'follow_up':
            return generateFollowUpEmail(
                data.professorName,
                data.studentName,
                data.daysSinceLastEmail
            );

        case 'thank_you':
            return generateThankYouEmail(
                data.professorName,
                data.studentName,
                data.meetingContext
            );

        case 'custom':
            return generateCustomEmail(data.template, data.variables);

        default:
            throw new Error(`Unknown template type: ${type}`);
    }
};

module.exports = {
    generateColdEmail,
    generateFollowUpEmail,
    generateThankYouEmail,
    generateCustomEmail,
    getTemplateTypes,
    generateEmailByType
};
