document.addEventListener("DOMContentLoaded", () => {
  // Estado global
  const state = {
    currentStep: 1,
    agents: [],
    chats: [],
  }

  // Gerenciamento de Agentes
  const createAgentBtn = document.getElementById("createAgent")
  const createAgentModal = document.getElementById("createAgentModal")
  const cancelAgentBtn = document.getElementById("cancelAgent")
  const agentForm = document.getElementById("agentForm")

  if (createAgentBtn) {
    createAgentBtn.addEventListener("click", () => {
      createAgentModal.classList.add("active")
    })
  }

  if (cancelAgentBtn) {
    cancelAgentBtn.addEventListener("click", () => {
      createAgentModal.classList.remove("active")
      agentForm.reset()
    })
  }

  if (agentForm) {
    agentForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Captura todos os campos do formulário
      const formData = new FormData(this)
      const agent = {
        id: Date.now(),
        name: formData.get("name"),
        personality: formData.get("personality"),
        knowledge: formData.get("knowledge"),
        color: formData.get("color"),
        icon: formData.get("icon"),
        responseFormat: formData.get("responseFormat"),
      }

      // Validação básica
      if (!agent.name || !agent.personality) {
        alert("Por favor, preencha todos os campos obrigatórios")
        return
      }

      // Adiciona o agente ao estado
      state.agents.push(agent)

      // Atualiza a interface
      updateAgentsList()

      // Limpa e fecha o formulário
      this.reset()
      createAgentModal.classList.remove("active")

      // Salva no localStorage para persistência
      localStorage.setItem("agents", JSON.stringify(state.agents))
    })
  }

  function updateAgentsList() {
    const agentsList = document.getElementById("agentsList")
    if (!agentsList) return

    agentsList.innerHTML =
      state.agents.length === 0
        ? `<div class="card center">
                <img src="https://api.iconify.design/lucide:bot.svg?color=white" alt="Robot">
                <h2>Vamos criar seu primeiro agente?</h2>
                <p>Nenhum agente foi cadastrado, crie seu primeiro agente em 5 minutos.</p>
                <button class="button" onclick="document.getElementById('createAgent').click()">CRIAR AGENTE</button>
               </div>`
        : state.agents
            .map(
              (agent) => `
                <div class="card">
                    <div class="agent-header" style="color: ${agent.color}">
                        <img src="https://api.iconify.design/lucide:${agent.icon}.svg?color=${agent.color}" alt="${agent.name}">
                        <h3>${agent.name}</h3>
                    </div>
                    <p>Personalidade: ${agent.personality}</p>
                    <p>Formato de Resposta: ${agent.responseFormat}</p>
                    <div class="button-group">
                        <button class="button secondary" onclick="editAgent(${agent.id})">Editar</button>
                        <button class="button" onclick="trainAgent(${agent.id})">Treinar</button>
                    </div>
                </div>
            `,
            )
            .join("")

    // Atualiza também a lista de agentes no chat
    updateChatAgentsList()
  }

  function updateChatAgentsList() {
    const chatAgentsList = document.getElementById("chatAgentsList")
    if (!chatAgentsList) return

    chatAgentsList.innerHTML = state.agents
      .map(
        (agent) => `
            <div class="chat-agent-item" style="border-left: 4px solid ${agent.color}">
                <div class="agent-info">
                    <img src="https://api.iconify.design/lucide:${agent.icon}.svg?color=${agent.color}" alt="${agent.name}">
                    <h4>${agent.name}</h4>
                </div>
                <p>Personalidade: ${agent.personality}</p>
                <button class="button small" onclick="startChatWithAgent(${agent.id})">Iniciar Chat</button>
            </div>
        `,
      )
      .join("")
  }

  // Funções auxiliares
  window.editAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return

    // Implementar lógica de edição
    console.log("Editando agente:", agent)
  }

  window.trainAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return

    // Implementar lógica de treinamento
    console.log("Treinando agente:", agent)
  }

  window.startChatWithAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return

    // Implementar lógica de início de chat
    console.log("Iniciando chat com agente:", agent)
  }

  // Carrega os agentes salvos ao iniciar
  const savedAgents = localStorage.getItem("agents")
  if (savedAgents) {
    state.agents = JSON.parse(savedAgents)
    updateAgentsList()
  }

  // Navegação
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pageName = item.dataset.page
      if (pageName) {
        navigateToPage(pageName)
      }
    })
  })

  function navigateToPage(pageName) {
    const pages = document.querySelectorAll(".page")
    pages.forEach((page) => page.classList.remove("active"))
    navItems.forEach((nav) => nav.classList.remove("active"))

    const selectedPage = document.getElementById(pageName)
    const selectedNav = document.querySelector(`[data-page="${pageName}"]`)

    if (selectedPage && selectedNav) {
      selectedPage.classList.add("active")
      selectedNav.classList.add("active")
    }
  }
})

