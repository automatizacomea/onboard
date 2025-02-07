document.addEventListener("DOMContentLoaded", () => {
  // Estado global
  const state = {
    currentStep: 1,
    agents: [],
    chats: [],
    settings: {
      openaiKey: localStorage.getItem("openaiKey") || "",
    },
  }

  // Elementos do DOM
  const createAgentBtn = document.getElementById("createAgent")
  const createAgentModal = document.getElementById("createAgentModal")
  const cancelAgentBtn = document.getElementById("cancelAgent")
  const agentForm = document.getElementById("agentForm")
  const openaiKeyInput = document.getElementById("openaiKey")
  const defaultOpenaiKeyInput = document.getElementById("defaultOpenaiKey")
  const chatAgentSelect = document.getElementById("chatAgent")
  const messageInput = document.getElementById("messageInput")
  const sendMessageBtn = document.getElementById("sendMessage")
  const chatMessages = document.getElementById("chatMessages")
  const saveSettingsBtn = document.getElementById("saveSettings")

  // Gerenciamento do Modal
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

  // Fechar modal clicando fora
  createAgentModal.addEventListener("click", (e) => {
    if (e.target === createAgentModal) {
      createAgentModal.classList.remove("active")
      agentForm.reset()
    }
  })

  // Gerenciamento de Agentes
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
        model: "gpt-4", // Definindo GPT-4 como modelo padrão
      }

      if (!agent.name || !agent.personality) {
        alert("Por favor, preencha todos os campos obrigatórios")
        return
      }

      state.agents.push(agent)
      updateAgentsList()
      updateChatAgentSelect()
      this.reset()
      createAgentModal.classList.remove("active")
      localStorage.setItem("agents", JSON.stringify(state.agents))
    })
  }

  // Atualização da lista de agentes
  function updateAgentsList() {
    const agentsList = document.getElementById("agentsList")
    if (!agentsList) return

    agentsList.innerHTML =
      state.agents.length === 0
        ? `<div class="text-center p-8 bg-white rounded-lg shadow">
                   <img src="https://api.iconify.design/lucide:bot.svg" alt="Robot" class="mx-auto mb-4 w-16 h-16 text-primary">
                   <h2 class="text-2xl font-bold mb-2">Vamos criar seu primeiro agente?</h2>
                   <p class="text-gray-600 mb-4">Nenhum agente foi cadastrado, crie seu primeiro agente em 5 minutos.</p>
                   <button class="button primary" onclick="document.getElementById('createAgent').click()">CRIAR AGENTE</button>
               </div>`
        : state.agents
            .map(
              (agent) => `
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div class="agent-header">
                        <img src="https://api.iconify.design/lucide:${agent.icon}.svg" alt="${agent.name}" class="w-8 h-8">
                        <h3 class="text-xl font-semibold">${agent.name}</h3>
                    </div>
                    <p class="text-gray-600 mb-2">Personalidade: ${agent.personality}</p>
                    <p class="text-gray-600 mb-4">Formato de Resposta: ${agent.responseFormat}</p>
                    <div class="flex justify-between">
                        <button class="button secondary small" onclick="editAgent(${agent.id})">Editar</button>
                        <button class="button primary small" onclick="startChatWithAgent(${agent.id})">Chat</button>
                    </div>
                </div>
            `,
            )
            .join("")
  }

  // Atualização do select de agentes no chat
  function updateChatAgentSelect() {
    if (!chatAgentSelect) return

    chatAgentSelect.innerHTML = `
            <option value="">Selecione um agente</option>
            ${state.agents
              .map(
                (agent) => `
                <option value="${agent.id}">${agent.name}</option>
            `,
              )
              .join("")}
        `
  }

  // Gerenciamento do Chat
  if (sendMessageBtn && messageInput && chatMessages) {
    sendMessageBtn.addEventListener("click", async () => {
      const message = messageInput.value.trim()
      const selectedAgentId = chatAgentSelect.value
      const openaiKey = openaiKeyInput.value || state.settings.openaiKey

      if (!message || !selectedAgentId || !openaiKey) {
        alert("Por favor, preencha todos os campos necessários")
        return
      }

      const agent = state.agents.find((a) => a.id === Number.parseInt(selectedAgentId))
      if (!agent) return

      // Adiciona mensagem do usuário
      addMessageToChat("user", message)
      messageInput.value = ""

      // Simula resposta do agente (aqui você implementaria a chamada real para a API da OpenAI)
      setTimeout(() => {
        addMessageToChat("agent", `Resposta do agente ${agent.name}: ${message}`)
      }, 1000)
    })
  }

  function addMessageToChat(type, message) {
    const messageElement = document.createElement("div")
    messageElement.className = `p-3 mb-2 rounded-lg ${type === "user" ? "bg-primary text-white ml-auto" : "bg-gray-100"} max-w-[80%]`
    messageElement.textContent = message
    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Gerenciamento de Configurações
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      const openaiKey = defaultOpenaiKeyInput.value
      if (openaiKey) {
        state.settings.openaiKey = openaiKey
        localStorage.setItem("openaiKey", openaiKey)
        alert("Configurações salvas com sucesso!")
      }
    })
  }

  // Carregamento inicial
  const savedAgents = localStorage.getItem("agents")
  if (savedAgents) {
    state.agents = JSON.parse(savedAgents)
    updateAgentsList()
    updateChatAgentSelect()
  }

  if (defaultOpenaiKeyInput) {
    defaultOpenaiKeyInput.value = state.settings.openaiKey
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
    pages.forEach((page) => {
      page.classList.add("hidden")
      page.classList.remove("active")
    })
    navItems.forEach((nav) => nav.classList.remove("active"))

    const selectedPage = document.getElementById(pageName)
    const selectedNav = document.querySelector(`[data-page="${pageName}"]`)

    if (selectedPage && selectedNav) {
      selectedPage.classList.remove("hidden")
      selectedPage.classList.add("active")
      selectedNav.classList.add("active")
    }
  }
})
