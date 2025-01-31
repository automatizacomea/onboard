document.addEventListener('DOMContentLoaded', function() {
    // Estado global
    const state = {
        currentStep: 1,
        agents: [],
        team: [],
        chats: [],
        invoices: []
    };

    // Navegação principal
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.dataset.page;
            if (pageName) {
                navigateToPage(pageName);
            }
        });
    });

    function navigateToPage(pageName) {
        navItems.forEach(nav => nav.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));

        const selectedNav = document.querySelector(`[data-page="${pageName}"]`);
        const selectedPage = document.getElementById(pageName);

        if (selectedNav && selectedPage) {
            selectedNav.classList.add('active');
            selectedPage.classList.add('active');
        }
    }

    // Step by Step - Cadastro e Onboarding
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            goToStep(2);
        });
    }

    function goToStep(step) {
        state.currentStep = step;
        const pages = ['login', 'confirmation', 'initial-setup'];
        pages.forEach(page => {
            document.getElementById(page)?.classList.remove('active');
        });
        
        switch(step) {
            case 1:
                document.getElementById('login').classList.add('active');
                break;
            case 2:
                document.getElementById('confirmation').classList.add('active');
                break;
            case 3:
                document.getElementById('initial-setup').classList.add('active');
                break;
            default:
                navigateToPage('dashboard');
        }
    }

    // Código de confirmação
    const codeInputs = document.querySelectorAll('.code-inputs input');
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            // Verifica se todos os campos foram preenchidos
            const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
            if (allFilled) {
                setTimeout(() => goToStep(3), 500);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });

    // Setup inicial
    const setupForm = document.getElementById('setupForm');
    if (setupForm) {
        setupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            navigateToPage('dashboard');
        });
    }

    // Gerenciamento de Agentes
    const createAgentBtn = document.getElementById('createAgent');
    const createAgentModal = document.getElementById('createAgentModal');
    const cancelAgentBtn = document.getElementById('cancelAgent');
    const agentForm = document.getElementById('agentForm');

    if (createAgentBtn) {
        createAgentBtn.addEventListener('click', () => {
            createAgentModal.classList.add('active');
        });
    }

    if (cancelAgentBtn) {
        cancelAgentBtn.addEventListener('click', () => {
            createAgentModal.classList.remove('active');
        });
    }

    if (agentForm) {
        agentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(agentForm);
            const agent = {
                id: Date.now(),
                name: formData.get('name'),
                personality: formData.get('personality'),
                knowledge: formData.get('knowledge')
            };
            state.agents.push(agent);
            updateAgentsList();
            createAgentModal.classList.remove('active');
            agentForm.reset();
        });
    }

    function updateAgentsList() {
        const agentsList = document.getElementById('agentsList');
        if (!agentsList) return;

        agentsList.innerHTML = state.agents.length === 0 
            ? `<div class="card center">
                <img src="https://api.iconify.design/lucide:bot.svg?color=white" alt="Robot">
                <h2>Vamos criar seu primeiro agente?</h2>
                <p>Nenhum agente foi cadastrado, crie seu primeiro agente em 5 minutos.</p>
                <button class="button" onclick="document.getElementById('createAgent').click()">CRIAR AGENTE</button>
               </div>`
            : state.agents.map(agent => `
                <div class="card">
                    <h3>${agent.name}</h3>
                    <p>Personalidade: ${agent.personality}</p>
                    <div class="button-group">
                        <button class="button secondary">Editar</button>
                        <button class="button">Treinar</button>
                    </div>
                </div>
            `).join('');
    }

    // Gerenciamento de Equipe
    const inviteTeamBtn = document.getElementById('inviteTeam');
    const inviteModal = document.getElementById('inviteModal');
    const cancelInviteBtn = document.getElementById('cancelInvite');
    const inviteForm = document.getElementById('inviteForm');

    if (inviteTeamBtn) {
        inviteTeamBtn.addEventListener('click', () => {
            inviteModal.classList.add('active');
        });
    }

    if (cancelInviteBtn) {
        cancelInviteBtn.addEventListener('click', () => {
            inviteModal.classList.remove('active');
        });
    }

    if (inviteForm) {
        inviteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(inviteForm);
            const member = {
                id: Date.now(),
                email: formData.get('email'),
                role: formData.get('role'),
                permissions: {
                    dashboard: formData.get('perm_dashboard') === 'on',
                    agents: formData.get('perm_agents') === 'on',
                    chat: formData.get('perm_chat') === 'on'
                }
            };
            state.team.push(member);
            updateTeamList();
            inviteModal.classList.remove('active');
            inviteForm.reset();
        });
    }

    function updateTeamList() {
        const teamGrid = document.querySelector('.team-grid');
        if (!teamGrid) return;

        teamGrid.innerHTML = state.team.length === 0
            ? `<div class="card center">
                <img src="https://api.iconify.design/lucide:users.svg?color=white" alt="Team">
                <h2>Convidar membro da equipe</h2>
                <p>Adicione outros usuários para fazer parte do seu time.</p>
                <button class="button" onclick="document.getElementById('inviteTeam').click()">CONVIDAR USUÁRIO</button>
               </div>`
            : state.team.map(member => `
                <div class="card">
                    <h3>${member.email}</h3>
                    <p>Função: ${member.role}</p>
                    <div class="permissions">
                        ${Object.entries(member.permissions)
                            .filter(([_, value]) => value)
                            .map(([key]) => `<span class="permission-tag">${key}</span>`)
                            .join('')}
                    </div>
                    <div class="button-group">
                        <button class="button secondary">Editar</button>
                        <button class="button">Remover</button>
                    </div>
                </div>
            `).join('');
    }

    // Chat
    const chatTabs = document.querySelectorAll('.tab');
    const messageInput = document.querySelector('.message-input textarea');
    const sendButton = document.querySelector('.send-button');

    chatTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chatTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateChatList(tab.textContent.toLowerCase());
        });
    });

    if (messageInput && sendButton) {
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                sendMessage(message);
                messageInput.value = '';
            }
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
    }

    function sendMessage(message) {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'message outgoing';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <span class="time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function updateChatList(filter) {
        const chatList = document.querySelector('.chat-list');
        if (!chatList) return;

        const filteredChats = state.chats.filter(chat => {
            if (filter === 'todos') return true;
            if (filter === 'em espera') return chat.status === 'waiting';
            if (filter === 'meus') return chat.assignedTo === 'currentUser';
            return true;
        });

        chatList.innerHTML = filteredChats.length === 0
            ? `<div class="empty-state">
                <p>Nenhuma conversa ${filter !== 'todos' ? 'neste filtro' : ''}</p>
               </div>`
            : filteredChats.map(chat => `
                <div class="chat-item">
                    <div class="chat-info">
                        <h4>${chat.customer}</h4>
                        <p>${chat.lastMessage}</p>
                    </div>
                    <span class="time">${chat.time}</span>
                </div>
            `).join('');
    }

    // Faturamento
    const planButtons = document.querySelectorAll('.plan-card .button');
    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            const plan = button.closest('.plan-card').querySelector('h3').textContent;
            selectPlan(plan);
        });
    });

    function selectPlan(plan) {
        // Simulação de seleção de plano
        alert(`Plano ${plan} selecionado! Em um ambiente real, isso abriria o processo de pagamento.`);
    }

    function updateInvoicesList() {
        const tbody = document.querySelector('.invoices-table tbody');
        if (!tbody) return;

        tbody.innerHTML = state.invoices.length === 0
            ? `<tr><td colspan="5" class="empty-state">Nenhuma fatura encontrada</td></tr>`
            : state.invoices.map(invoice => `
                <tr>
                    <td>${new Date(invoice.date).toLocaleDateString()}</td>
                    <td>${invoice.plan}</td>
                    <td>R$ ${invoice.amount.toFixed(2)}</td>
                    <td><span class="status ${invoice.status}">${invoice.status}</span></td>
                    <td>
                        <button class="button secondary small">Download</button>
                    </td>
                </tr>
            `).join('');
    }

    // Inicialização
    updateAgentsList();
    updateTeamList();
    updateChatList('todos');
    updateInvoicesList();
});
