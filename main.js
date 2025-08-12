const state = {
    selectedDigimon: null,
    isLoading: false,
    error: '',
};

const renderApp = () => {
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = '';
    
    if (state.isLoading) {
        appContainer.appendChild(LoadingSpinner());
    } else if (state.selectedDigimon) {
        appContainer.appendChild(DigimonDetailsPage());
    } else {
        appContainer.appendChild(SearchPage());
    }
}

const setState = (newState) => {
    Object.assign(state, newState);
    renderApp();
}

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
    p.className = 'error-message';
    p.textContent = message;
    return p;
}

function SearchPage() {
    const page = document.createElement('div');
    page.className = 'search-page';
    page.innerHTML = `
        <h1></h1>
    `;
    
    
    
    return page;
}

renderApp()