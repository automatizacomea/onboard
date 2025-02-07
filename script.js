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
      createAgentModal.classList.remove("hidden")
    })
  }

  if (cancelAgentBtn) {
    cancelAgentBtn.addEventListener("click", () => {
      createAgentModal.classList.add("hidden")
      agentForm.reset()
    })
  }

  if (agentForm) {
    agentForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const formData = new FormData(this)
      const agent = {
        id: Date.now(),
        name: formData.get("name"),
        personality: formData.get("personality"),
        knowledge: formData.get("knowledge"),
        icon: formData.get("icon"),
        responseFormat: formData.get("responseFormat"),
      }

      if (!agent.name || !agent.personality) {
        alert("Por favor, preencha todos os campos obrigatórios")
        return
      }

      state.agents.push(agent)
      updateAgentsList()
      this.reset()
      createAgentModal.classList.add("hidden")
      localStorage.setItem("agents", JSON.stringify(state.agents))
    })
  }

  function updateAgentsList() {
    const agentsList = document.getElementById("agentsList")
    if (!agentsList) return

    agentsList.innerHTML =
      state.agents.length === 0
        ? `<div class="text-center p-8 bg-white rounded-lg shadow">
                   <img src="https://api.iconify.design/lucide:bot.svg" alt="Robot" class="mx-auto mb-4 w-16 h-16 text-blue-500">
                   <h2 class="text-2xl font-bold mb-2">Vamos criar seu primeiro agente?</h2>
                   <p class="text-gray-600 mb-4">Nenhum agente foi cadastrado, crie seu primeiro agente em 5 minutos.</p>
                   <button class="button primary" onclick="document.getElementById('createAgent').click()">CRIAR AGENTE</button>
               </div>`
        : state.agents
            .map(
              (agent) => `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="agent-header">
                        <img src="https://api.iconify.design/lucide:${agent.icon}.svg" alt="${agent.name}" class="w-8 h-8">
                        <h3 class="text-xl font-semibold">${agent.name}</h3>
                    </div>
                    <p class="text-gray-600 mb-2">Personalidade: ${agent.personality}</p>
                    <p class="text-gray-600 mb-4">Formato de Resposta: ${agent.responseFormat}</p>
                    <div class="flex justify-between">
                        <button class="button secondary small" onclick="editAgent(${agent.id})">Editar</button>
                        <button class="button primary small" onclick="trainAgent(${agent.id})">Treinar</button>
                    </div>
                </div>
            `,
            )
            .join("")

    updateChatAgentsList()
  }

  function updateChatAgentsList() {
    const chatAgentsList = document.getElementById("chatAgentsList")
    if (!chatAgentsList) return

    chatAgentsList.innerHTML = state.agents
      .map(
        (agent) => `
            <div class="chat-agent-item">
                <div class="agent-info">
                    <img src="https://api.iconify.design/lucide:${agent.icon}.svg" alt="${agent.name}" class="w-6 h-6">
                    <h4 class="text-lg font-semibold">${agent.name}</h4>
                </div>
                <p class="text-gray-600 mb-3">Personalidade: ${agent.personality}</p>
                <button class="button primary small w-full" onclick="startChatWithAgent(${agent.id})">Iniciar Chat</button>
            </div>
        `,
      )
      .join("")
  }

  // Funções auxiliares
  window.editAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return
    console.log("Editando agente:", agent)
    // Implementar lógica de edição
  }

  window.trainAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return
    console.log("Treinando agente:", agent)
    // Implementar lógica de treinamento
  }

  window.startChatWithAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return
    console.log("Iniciando chat com agente:", agent)
    // Implementar lógica de início de chat
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
    pages.forEach((page) => page.classList.add("hidden"))
    navItems.forEach((nav) => nav.classList.remove("active"))

    const selectedPage = document.getElementById(pageName)
    const selectedNav = document.querySelector(`[data-page="${pageName}"]`)

    if (selectedPage && selectedNav) {
      selectedPage.classList.remove("hidden")
      selectedNav.classList.add("active")
    }
  }
})
