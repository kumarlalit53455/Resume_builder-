document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resume-form');
    const downloadBtn = document.getElementById('download-pdf');
    const clearBtn = document.getElementById('clear-form');
    const templateSelector = document.getElementById('template-selector');
    const resumePreview = document.getElementById('resume-preview');
    const progressBar = document.getElementById('progress-bar');
    const photoInput = document.getElementById('photo');
    const previewPhoto = document.getElementById('preview-photo');

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;

    // Sections
    const educationSection = document.getElementById('education-section');
    const experienceSection = document.getElementById('experience-section');
    const skillsSection = document.getElementById('skills-section');

    // Preview Elements
    const preview = {
        name: document.getElementById('preview-name'),
        email: document.getElementById('preview-email'),
        education: document.getElementById('preview-education'),
        experience: document.getElementById('preview-experience'),
        skills: document.getElementById('preview-skills'),
        photo: document.getElementById('preview-photo')
    };

    // Event Listeners for Adding Entries
    document.getElementById('add-education').addEventListener('click', addEducation);
    document.getElementById('add-experience').addEventListener('click', addExperience);
    document.getElementById('add-skill').addEventListener('click', addSkill);

    // Event Listener for Template Selection
    templateSelector.addEventListener('change', changeTemplate);

    // Form Input Event Listener
    form.addEventListener('input', () => {
        updatePreview();
        updateProgressBar();
    });

    // Photo Upload Event Listener
    photoInput.addEventListener('change', handlePhotoUpload);

    // Form Submit Event Listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Resume updated!');
    });

    // Download PDF Event Listener
    downloadBtn.addEventListener('click', downloadPDF);

    // Clear Form Event Listener
    clearBtn.addEventListener('click', clearForm);

    // Function to Add Education Entry
    function addEducation() {
        const entry = document.createElement('div');
        entry.classList.add('education-entry');
        entry.innerHTML = `
            <label>
                School:
                <input type="text" class="school" placeholder="University Name" required>
            </label>
            <label>
                Degree:
                <input type="text" class="degree" placeholder="Bachelor of Science" required>
            </label>
            <label>
                Graduation Year:
                <input type="number" class="graduation-year" placeholder="2024" required>
            </label>
            <button type="button" class="remove-education">Remove</button>
        `;
        educationSection.insertBefore(entry, document.getElementById('add-education'));

        // Add Event Listener for Remove Button
        entry.querySelector('.remove-education').addEventListener('click', () => {
            entry.remove();
            updatePreview();
            updateProgressBar();
        });
    }

    // Function to Add Experience Entry
    function addExperience() {
        const entry = document.createElement('div');
        entry.classList.add('experience-entry');
        entry.innerHTML = `
            <label>
                Company:
                <input type="text" class="company" placeholder="Company Name" required>
            </label>
            <label>
                Role:
                <input type="text" class="role" placeholder="Software Engineer" required>
            </label>
            <label>
                Years:
                <input type="text" class="years" placeholder="2018 - 2024" required>
            </label>
            <button type="button" class="remove-experience">Remove</button>
        `;
        experienceSection.insertBefore(entry, document.getElementById('add-experience'));

        // Add Event Listener for Remove Button
        entry.querySelector('.remove-experience').addEventListener('click', () => {
            entry.remove();
            updatePreview();
            updateProgressBar();
        });
    }

    // Function to Add Skill Entry
    function addSkill() {
        const entry = document.createElement('div');
        entry.classList.add('skills-entry');
        entry.innerHTML = `
            <label>
                Skill:
                <input type="text" class="skill" placeholder="JavaScript" required>
            </label>
            <button type="button" class="remove-skill">Remove</button>
        `;
        skillsSection.insertBefore(entry, document.getElementById('add-skill'));

        // Add Event Listener for Remove Button
        entry.querySelector('.remove-skill').addEventListener('click', () => {
            entry.remove();
            updatePreview();
            updateProgressBar();
        });
    }

    // Function to Change Template
    function changeTemplate() {
        const selectedTemplate = templateSelector.value;
        resumePreview.classList.remove('template1', 'template2', 'template3');
        resumePreview.classList.add(selectedTemplate);
    }

    // Function to Update Resume Preview
    function updatePreview() {
        // Personal Information
        const fullName = document.getElementById('full-name').value || 'John Doe';
        const email = document.getElementById('email').value || 'john@example.com';
        const phone = document.getElementById('phone').value || '(123) 456-7890';
        preview.name.textContent = fullName;
        preview.email.textContent = `${email} | ${phone}`;

        // Education
        const educationEntries = educationSection.querySelectorAll('.education-entry');
        preview.education.innerHTML = '';
        educationEntries.forEach(entry => {
            const school = entry.querySelector('.school').value || 'University Name';
            const degree = entry.querySelector('.degree').value || 'Bachelor of Science';
            const gradYear = entry.querySelector('.graduation-year').value || '2024';
            const p = document.createElement('p');
            p.innerHTML = `<strong>${degree}</strong> from <span>${school}</span>, <span>${gradYear}</span>`;
            preview.education.appendChild(p);
        });

        // Experience
        const experienceEntries = experienceSection.querySelectorAll('.experience-entry');
        preview.experience.innerHTML = '';
        experienceEntries.forEach(entry => {
            const company = entry.querySelector('.company').value || 'Company Name';
            const role = entry.querySelector('.role').value || 'Software Engineer';
            const years = entry.querySelector('.years').value || '2018 - 2024';
            const p = document.createElement('p');
            p.innerHTML = `<strong>${role}</strong> at <span>${company}</span> (<span>${years}</span>)`;
            preview.experience.appendChild(p);
        });

        // Skills
        const skillEntries = skillsSection.querySelectorAll('.skill');
        preview.skills.innerHTML = '';
        skillEntries.forEach(skillInput => {
            const skill = skillInput.value.trim();
            if (skill) {
                const li = document.createElement('li');
                li.textContent = skill;
                preview.skills.appendChild(li);
            }
        });
    }

    // Function to Handle Photo Upload
    function handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.photo.src = e.target.result;
            }
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file.');
            photoInput.value = '';
        }
    }

    // Function to Download Resume as PDF
    function downloadPDF() {
        html2canvas(resumePreview).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save(`${preview.name.textContent}_Resume.pdf`);
        });
    }

    // Function to Clear Form
    function clearForm() {
        if (confirm('Are you sure you want to clear the form? This will reset all fields.')) {
            form.reset();
            // Remove additional entries except the first ones
            while (educationSection.querySelectorAll('.education-entry').length > 1) {
                educationSection.removeChild(educationSection.lastElementChild);
            }
            while (experienceSection.querySelectorAll('.experience-entry').length > 1) {
                experienceSection.removeChild(experienceSection.lastElementChild);
            }
            while (skillsSection.querySelectorAll('.skills-entry').length > 1) {
                skillsSection.removeChild(skillsSection.lastElementChild);
            }
            // Reset profile photo
            preview.photo.src = 'assets/default-profile.png';
            // Reset template
            templateSelector.value = 'template1';
            changeTemplate();
            // Update preview and progress bar
            updatePreview();
            updateProgressBar();
        }
    }

    // Function to Update Progress Bar
    function updateProgressBar() {
        const totalFields = form.querySelectorAll('input').length;
        let filledFields = 0;

        form.querySelectorAll('input').forEach(input => {
            if (input.type === 'file') {
                if (input.files.length > 0) filledFields++;
            } else if (input.value.trim() !== '') {
                filledFields++;
            }
        });

        const progressPercent = Math.round((filledFields / totalFields) * 100);
        progressBar.style.width = `${progressPercent}%`;
    }

    // Initialize with one entry each
    addEducation();
    addExperience();
    addSkill();

    // Initial Template
    changeTemplate();

    // Initialize preview
    updatePreview();
    updateProgressBar();
});
