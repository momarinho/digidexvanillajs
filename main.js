document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://placehold.co/200x200/4a4a8a/ffffff?text=No+Image&font=vt323';
        e.target.onerror = null;
    }
}, true);

const state = {
    selectedDigimon: null,
    isLoading: false,
    error: '',
};

// Função para notificar a UI de que o estado mudou e renderizar novamente
const renderApp = () => {
    const appContainer = document.getElementById('app-container');
    // Limpa o conteúdo atual
    appContainer.innerHTML = '';

    // Define o conteúdo com base no estado
    if (state.isLoading) {
        appContainer.appendChild(LoadingSpinner());
    } else if (state.selectedDigimon) {
        appContainer.appendChild(DigimonDetailsPage());
    } else {
 appContainer.appendChild(SearchPage());
    }
}

// Função para atualizar o estado e acionar a renderização
function setState(newState) {
    Object.assign(state, newState);
    renderApp();
}

// --- Camada de Serviço da API ---
const getDigimon = async (term) => {
    const response = await fetch(`https://digi-api.com/api/v1/digimon/${encodeURIComponent(term)}`);
    if (!response.ok) {
        throw new Error(`Digimon "${name}" not found. Please try again.`);
    }
    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        image: data.images[0]?.href,
        level: data.levels?.find(l => l.level)?.level || 'N/A',
        type: data.types?.find(t => t.type)?.type || 'N/A',
        attribute: data.attributes?.find(a => a.attribute)?.attribute || 'N/A',
        fields: data.fields?.map(f => ({ name: f.field, image: f.image })) || [],
        profile: data.descriptions?.find(d => d.language === 'en_us')?.description || 'No description available.',
        skills: data.skills?.map(s => ({ name: s.skill, description: s.description })) || [],
        evolutions: data.nextEvolutions || [],
        priorEvolutions: data.priorEvolutions || [],
    };
}

// --- Componentes da UI (Funções que criam e retornam elementos DOM) ---
const LoadingSpinner = () => {
    const container = document.createElement('div');
    container.className = 'loading-container';
    container.innerHTML = `
        <div class="loading-spinner"></div>
        <p class="loading-text">Searching the Digital World...</p>
    `;
    return container;
}

const ErrorMessage = (message) => {
    const p = document.createElement('p');
    p.className = 'error-text';
    p.textContent = message;
    return p;
}

const SectionHeader = (title) => {
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <div class="header-decorator"></div>
        <h3 class="header-text">${title}</h3>
        <div class="header-line"></div>
    `;
    return header;
}

const SearchPage = () => {
    const page = document.createElement('div');
    page.className = 'search-page fade-in';
    page.innerHTML = `
        <h1 class="search-title">Digi-Dex</h1>
        <p class="search-description">
            Welcome to your Digimon Encyclopedia.
            <br>Enter the name of a Digimon or ID below to find out more about it.
        </p>
        <form class="search-form">
            <input
                type="text"
                class="search-input"
                placeholder="e.g. Agumon, 477..."
                value=""
            />
            <button type="submit" class="search-button">Search</button>
        </form>
    `;
    
    const searchInput = page.querySelector('.search-input');
    const searchForm = page.querySelector('.search-form');
    const searchButton = page.querySelector('.search-button');

    // Renderiza o spinner ou o erro se existirem no estado
    if (state.isLoading) {
        page.appendChild(LoadingSpinner());
        searchButton.disabled = true;
        searchButton.textContent = '...';
        searchInput.disabled = true;
    } else if (state.error) {
        page.appendChild(ErrorMessage(state.error));
 }

    // Adiciona o event listener ao formulário
 searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value;
        if (!searchTerm) return;
        
        setState({ isLoading: true, error: '' });
        
        try {
            const digimonData = await getDigimon(searchTerm);
            setState({ selectedDigimon: digimonData });
        } catch (err) {
            setState({ error: err.message });
        } finally {
            setState({ isLoading: false });
        }
    });

    return page;
}

const DigimonDetailsPage = () => {
    const digimon = state.selectedDigimon;
 if (!digimon) return document.createElement('div');

    const page = document.createElement('div');
    page.className = 'details-page fade-in';

    // Painel da esquerda
    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';
    leftPanel.innerHTML = `
        <div class="details-header">
            <button class="back-button">Back</button>
        </div>
        <h2 class="digimon-name">${digimon.name}</h2>        
        <div class="image-container zoom-in">
            <img
                src="${digimon.image}"
                alt="Image of ${digimon.name}"
                class="digimon-image"
                onerror="this.onerror=null; this.src='https://placehold.co/200x200/4a4a8a/ffffff?text=${digimon.name.charAt(0)}&font=vt323';"
            />
        </div>
        <div class="info-grid">
            <div class="info-item fade-in-up-stagger" style="animation-delay: 0.1s;">
                <span class="info-item-label">Level</span>
                <span class="info-item-value-text">${digimon.level}</span>
            </div>
            <div class="info-item fade-in-up-stagger" style="animation-delay: 0.2s;">
                <span class="info-item-label">Type</span>
                <span class="info-item-value-text">${digimon.type}</span>
            </div>
            <div class="info-item fade-in-up-stagger" style="animation-delay: 0.3s;">
                <span class="info-item-label">Attribute</span>
                <span class="info-item-value-text">${digimon.attribute}</span>
            </div>
            <div class="info-item fade-in-up-stagger" style="animation-delay: 0.4s;">
                <span class="info-item-label">Field</span>
                <div class="info-item-value field-images-container">
                    ${digimon.fields.length > 0 ? digimon.fields.map(field => `
                        <img
                            src="${field.image}"
                            alt="${field.name}"
                            class="field-image"
                            onerror="this.onerror=null; this.src='https://placehold.co/30x30/4a4a8a/ffffff?text=${field.name.charAt(0)}&font=vt323';"
                            title="${field.name}"
                        />
                    `).join('') : '<span class="info-item-value-text">N/A</span>'}
                </div>
            </div>
        </div>
    `;
    page.appendChild(leftPanel);

    // Painel da direita
    const rightPanel = document.createElement('div');
    rightPanel.className = 'right-panel';

    // Perfil
    const profileSection = document.createElement('div');
    profileSection.className = 'data-section slide-in-right';
    profileSection.style.animationDelay = '0.5s';
    profileSection.appendChild(SectionHeader('Profile'));
    profileSection.innerHTML += `<p class="profile-text">${digimon.profile}</p>`;
    rightPanel.appendChild(profileSection);

    // Habilidades
    const skillsSection = document.createElement('div');
    skillsSection.className = 'data-section slide-in-right';
    skillsSection.style.animationDelay = '0.6s';
    skillsSection.appendChild(SectionHeader('Skills'));
    if (digimon.skills.length > 0) {
        const skillsList = document.createElement('div');
        skillsList.className = 'skills-list';
        skillsList.innerHTML = digimon.skills.map((skill, index) => `
            <div class="skill-item fade-in-up-stagger" style="animation-delay: ${0.7 + index * 0.1}s;">
                <p class="skill-name">${skill.name}</p>
                <p class="skill-description">${skill.description}</p>
            </div>
        `).join('');
        skillsSection.appendChild(skillsList);
    } else {
        skillsSection.innerHTML += `<p class="profile-text">No known skills.</p>`;
    }
    rightPanel.appendChild(skillsSection);

    // Evoluções Anteriores
    const priorEvolutionsSection = document.createElement('div');
    priorEvolutionsSection.className = 'data-section slide-in-right';
    priorEvolutionsSection.style.animationDelay = '0.8s';
    priorEvolutionsSection.appendChild(SectionHeader('Prior Evolutions'));
    if (digimon.priorEvolutions.length > 0) {
        const evoList = document.createElement('ul');
        evoList.className = 'evolution-list';
        evoList.innerHTML = digimon.priorEvolutions.map((evo, index) => `
            <li
                class="evolution-item fade-in-up-stagger"
                style="animation-delay: ${0.9 + index * 0.05}s;"
                data-digimon-name="${evo.digimon}"
            >
                <img
                    src="${evo.image || `https://placehold.co/50x50/4a4a8a/ffffff?text=${evo.digimon.charAt(0)}&font=vt323`}"
                    alt="${evo.digimon}"
                    class="evolution-image"
                    onerror="this.onerror=null; this.src='https://placehold.co/50x50/4a4a8a/ffffff?text=${evo.digimon.charAt(0)}&font=vt323';"
                />
                <span class="evolution-name">${evo.digimon}</span>
            </li>
        `).join('');
        priorEvolutionsSection.appendChild(evoList);
    } else {
        priorEvolutionsSection.innerHTML += `<p class="profile-text">No prior evolutions.</p>`;
    }
    rightPanel.appendChild(priorEvolutionsSection);
    
    // Próximas Evoluções
    const nextEvolutionsSection = document.createElement('div');
    nextEvolutionsSection.className = 'data-section slide-in-right';
    nextEvolutionsSection.style.animationDelay = '1.0s';
    nextEvolutionsSection.appendChild(SectionHeader('Next Evolutions'));
 if (digimon.evolutions.length > 0) {
        const evoList = document.createElement('ul');
        evoList.className = 'evolution-list';
        evoList.innerHTML = digimon.evolutions.map((evo, index) => `
            <li
                class="evolution-item fade-in-up-stagger"
                style="animation-delay: ${1.1 + index * 0.05}s;"
                data-digimon-name="${evo.digimon}"
            >
                <img
                    src="${evo.image || `https://placehold.co/50x50/4a4a8a/ffffff?text=${evo.digimon.charAt(0)}&font=vt323`}"
                    alt="${evo.digimon}"
                    class="evolution-image"
                    onerror="this.onerror=null; this.src='https://placehold.co/50x50/4a4a8a/ffffff?text=${evo.digimon.charAt(0)}&font=vt323';"
                />
                <span class="evolution-name">${evo.digimon}</span>
            </li>
        `).join('');
        nextEvolutionsSection.appendChild(evoList);
    } else {
        nextEvolutionsSection.innerHTML += `<p class="profile-text">No known evolutions.</p>`;
    }
    rightPanel.appendChild(nextEvolutionsSection);

    page.appendChild(rightPanel);

    // Adiciona event listeners dinamicamente
    const backButton = page.querySelector('.back-button');
    backButton.addEventListener('click', () => {
        setState({ selectedDigimon: null, error: '' });
    });
    
    // Adiciona event listener para cliques em evoluções
    const evolutionItems = page.querySelectorAll('.evolution-item');
    evolutionItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            const digimonName = item.getAttribute('data-digimon-name');
            if (!digimonName) return;

            setState({ isLoading: true, error: '' });

            try {
                const digimonData = await getDigimon(digimonName);
                setState({ selectedDigimon: digimonData });
            } catch (err) {
                setState({ error: err.message });
            } finally {
                setState({ isLoading: false });
            }
        });
    });

    return page;
}

// Inicia a aplicação
renderApp();