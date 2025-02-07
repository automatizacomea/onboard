document.addEventListener("DOMContentLoaded", () => {
  // Estado global
  const state = {
    currentStep: 1,
    agents: [],
    chats: {},
    instances: [],
  }

  // Elementos do DOM
  const createAgentBtn = document.getElementById("createAgent")
  const createAgentModal = document.getElementById("createAgentModal")
  const cancelAgentBtn = document.getElementById("cancelAgent")
  const agentForm = document.getElementById("agentForm")
  const openaiKeyInput = document.getElementById("openaiKey")
  const chatAgentSelect = document.getElementById("chatAgent")
  const messageInput = document.getElementById("messageInput")
  const sendMessageBtn = document.getElementById("sendMessage")
  const resetChatBtn = document.getElementById("resetChat")
  const chatMessages = document.getElementById("chatMessages")
  const createInstanceBtn = document.getElementById("createInstance")
  const createInstanceModal = document.getElementById("createInstanceModal")
  const cancelInstanceBtn = document.getElementById("cancelInstance")
  const connectInstanceBtn = document.getElementById("connectInstance")

  // Gerenciamento dos Modais
  function setupModal(modalElement, openBtn, closeBtn) {
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        modalElement.classList.add("active")
      })
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modalElement.classList.remove("active")
        const form = modalElement.querySelector("form")
        if (form) form.reset()
      })
    }

    modalElement.addEventListener("click", (e) => {
      if (e.target === modalElement) {
        modalElement.classList.remove("active")
        const form = modalElement.querySelector("form")
        if (form) form.reset()
      }
    })
  }

  setupModal(createAgentModal, createAgentBtn, cancelAgentBtn)
  setupModal(createInstanceModal, createInstanceBtn, cancelInstanceBtn)

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
        model: "gpt-4",
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
                    <div class="flex justify-between gap-2">
                        <button class="button secondary small" onclick="editAgent(${agent.id})">Editar</button>
                        <button class="button primary small" onclick="startChatWithAgent(${agent.id})">Chat</button>
                        <button class="button danger small" onclick="deleteAgent(${agent.id})">Excluir</button>
                    </div>
                </div>
            `,
            )
            .join("")
  }

  // Funções de gerenciamento de agentes
  window.editAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return

    createAgentModal.classList.add("active")
    const form = document.getElementById("agentForm")

    form.querySelector("#agentName").value = agent.name
    form.querySelector("#agentPersonality").value = agent.personality
    form.querySelector("#agentKnowledge").value = agent.knowledge || ""
    form.querySelector("#agentIcon").value = agent.icon
    form.querySelector("#responseFormat").value = agent.responseFormat

    // Atualiza o handler do formulário para edição
    form.onsubmit = (e) => {
      e.preventDefault()
      const formData = new FormData(form)

      const updatedAgent = {
        ...agent,
        name: formData.get("name"),
        personality: formData.get("personality"),
        knowledge: formData.get("knowledge"),
        icon: formData.get("icon"),
        responseFormat: formData.get("responseFormat"),
      }

      const index = state.agents.findIndex((a) => a.id === agentId)
      state.agents[index] = updatedAgent

      updateAgentsList()
      updateChatAgentSelect()
      form.reset()
      createAgentModal.classList.remove("active")
      localStorage.setItem("agents", JSON.stringify(state.agents))

      // Restaura o handler original
      form.onsubmit = null
    }
  }

  window.deleteAgent = (agentId) => {
    if (!confirm("Tem certeza que deseja excluir este agente?")) return

    state.agents = state.agents.filter((a) => a.id !== agentId)
    updateAgentsList()
    updateChatAgentSelect()
    localStorage.setItem("agents", JSON.stringify(state.agents))
  }

  window.startChatWithAgent = (agentId) => {
    const agent = state.agents.find((a) => a.id === agentId)
    if (!agent) return

    // Navega para a página de chat
    navigateToPage("chatsPage")

    // Seleciona o agente no select
    if (chatAgentSelect) {
      chatAgentSelect.value = agent.id
    }
  }

  // Gerenciamento do Chat
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

  if (sendMessageBtn && messageInput && chatMessages) {
    sendMessageBtn.addEventListener("click", async () => {
      const message = messageInput.value.trim()
      const selectedAgentId = chatAgentSelect.value
      const openaiKey = openaiKeyInput.value

      if (!message || !selectedAgentId || !openaiKey) {
        alert("Por favor, preencha todos os campos necessários")
        return
      }

      const agent = state.agents.find((a) => a.id === Number.parseInt(selectedAgentId))
      if (!agent) return

      // Adiciona mensagem do usuário
      addMessageToChat("user", message)
      messageInput.value = ""

      try {
        // Simula chamada à API da OpenAI (implementar integração real aqui)
        const response = await simulateOpenAIResponse(message, agent)
        addMessageToChat("agent", response)
      } catch (error) {
        addMessageToChat("error", "Erro ao processar mensagem. Por favor, tente novamente.")
      }
    })
  }

  if (resetChatBtn) {
    resetChatBtn.addEventListener("click", () => {
      if (!confirm("Tem certeza que deseja resetar a conversa?")) return

      if (chatMessages) {
        chatMessages.innerHTML = ""
      }

      const selectedAgentId = chatAgentSelect.value
      if (selectedAgentId) {
        state.chats[selectedAgentId] = []
      }
    })
  }

  function addMessageToChat(type, message) {
    const messageElement = document.createElement("div")
    messageElement.className = `p-3 mb-2 rounded-lg ${type === "user" ? "bg-primary text-white ml-auto" : type === "error" ? "bg-danger text-white" : "bg-gray-100"} max-w-[80%]`
    messageElement.textContent = message
    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Salva a mensagem no estado
    const selectedAgentId = chatAgentSelect.value
    if (selectedAgentId) {
      if (!state.chats[selectedAgentId]) {
        state.chats[selectedAgentId] = []
      }
      state.chats[selectedAgentId].push({ type, message })
    }
  }

  // Simulação de resposta da OpenAI (substituir por integração real)
  async function simulateOpenAIResponse(message, agent) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `[${agent.name}] Resposta simulada para: ${message}`
  }

  // Gerenciamento de Instâncias WhatsApp
  if (connectInstanceBtn) {
    connectInstanceBtn.addEventListener("click", () => {
      const phoneNumber = document.getElementById("phoneNumber").value
      if (!phoneNumber) {
        alert("Por favor, insira um número de telefone")
        return
      }

      // Implementar lógica de conexão do WhatsApp aqui
      alert("Função de conexão do WhatsApp será implementada aqui")
      createInstanceModal.classList.remove("active")
    })
  }

  // Carregamento inicial
  const savedAgents = localStorage.getItem("agents")
  if (savedAgents) {
    state.agents = JSON.parse(savedAgents)
    updateAgentsList()
    updateChatAgentSelect()
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
