/**
 * Seed Script - Populate Supabase with Fake Professor Data
 * Run this script to add test data to your database
 * 
 * Usage: node database/seedData.js
 */

require('dotenv').config();
const { supabaseAdmin } = require('../supabase/supabaseClient');

// Fake data arrays
const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
    'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
    'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker'
];

const universities = [
    'Stanford University',
    'MIT',
    'Harvard University',
    'UC Berkeley',
    'Carnegie Mellon University',
    'Princeton University',
    'Yale University',
    'Columbia University',
    'University of Michigan',
    'Cornell University',
    'University of Chicago',
    'Northwestern University',
    'Duke University',
    'Johns Hopkins University',
    'University of Pennsylvania',
    'Caltech',
    'UCLA',
    'University of Washington',
    'Georgia Tech',
    'UT Austin'
];

const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Bioengineering',
    'Chemical Engineering',
    'Physics',
    'Mathematics',
    'Statistics',
    'Data Science',
    'Artificial Intelligence'
];

const researchAreas = [
    'Machine Learning',
    'Artificial Intelligence',
    'Deep Learning',
    'Neural Networks',
    'Computer Vision',
    'Natural Language Processing',
    'Robotics',
    'Quantum Computing',
    'Cybersecurity',
    'Distributed Systems',
    'Human-Computer Interaction',
    'Data Mining',
    'Bioinformatics',
    'Computational Biology',
    'Signal Processing',
    'Internet of Things',
    'Blockchain',
    'Cloud Computing',
    'Edge Computing',
    'Reinforcement Learning',
    'Computer Graphics',
    'Virtual Reality',
    'Augmented Reality',
    'Software Engineering',
    'Database Systems',
    'Operating Systems',
    'Computer Networks',
    'Algorithms',
    'Optimization',
    'Cryptography'
];

// Helper functions
const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

const randomElements = (array, min = 2, max = 4) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const randomRating = () => {
    return (Math.random() * 1.5 + 3.5).toFixed(1); // Between 3.5 and 5.0
};

const generateEmail = (firstName, lastName, university) => {
    const domain = university.toLowerCase()
        .replace(/university/g, '')
        .replace(/\s+/g, '')
        .replace(/^the/, '') + '.edu';
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

const generateProfessor = () => {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const university = randomElement(universities);
    const department = randomElement(departments);
    const interests = randomElements(researchAreas, 2, 5).join(', ');
    const acceptingStudents = Math.random() > 0.3; // 70% accepting
    const rating = randomRating();
    const email = generateEmail(firstName, lastName, university);

    return {
        name: `Dr. ${firstName} ${lastName}`,
        email,
        university,
        department,
        research_interests: interests,
        accepting_students: acceptingStudents,
        rating: parseFloat(rating),
        website: `https://${university.toLowerCase().replace(/\s+/g, '')}.edu/faculty/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        bio: `Dr. ${lastName} is a leading researcher in ${interests.split(',')[0]} with over 10 years of experience in academia.`
    };
};

// Main seeding function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        if (!supabaseAdmin) {
            console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env file');
            console.log('Please add your service role key to the .env file and try again.');
            process.exit(1);
        }

        // Generate fake professors
        const numberOfProfessors = 50;
        console.log(`📊 Generating ${numberOfProfessors} fake professors...`);

        const professors = [];
        for (let i = 0; i < numberOfProfessors; i++) {
            professors.push(generateProfessor());
        }

        console.log('✅ Generated professor data\n');

        // Insert into Supabase
        console.log('📤 Inserting data into Supabase...');

        const { data, error } = await supabaseAdmin
            .from('professors')
            .insert(professors)
            .select();

        if (error) {
            console.error('❌ Error inserting data:', error.message);
            console.log('\nTroubleshooting:');
            console.log('1. Make sure you ran the database/schema.sql in Supabase SQL Editor');
            console.log('2. Check that your SUPABASE_SERVICE_ROLE_KEY is correct in .env');
            console.log('3. Verify your Supabase project is active');
            process.exit(1);
        }

        console.log(`✅ Successfully inserted ${data.length} professors!\n`);

        // Display summary
        console.log('📈 Summary:');
        console.log(`   Total Professors: ${data.length}`);
        console.log(`   Universities: ${[...new Set(professors.map(p => p.university))].length}`);
        console.log(`   Departments: ${[...new Set(professors.map(p => p.department))].length}`);
        console.log(`   Accepting Students: ${professors.filter(p => p.accepting_students).length}`);
        console.log(`   Average Rating: ${(professors.reduce((sum, p) => sum + p.rating, 0) / professors.length).toFixed(2)}`);

        console.log('\n🎉 Database seeding complete!');
        console.log('\nYou can now:');
        console.log('1. Start your server: npm run dev');
        console.log('2. Test the search: curl http://localhost:5000/api/search/professors');
        console.log('3. View data in Supabase Table Editor');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
};

// Run the seeding
seedDatabase();
