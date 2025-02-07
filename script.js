document.addEventListener("DOMContentLoaded", () => {
  try {
    // Estado global
    const state = {
      currentStep: 1,
      agents: [],
      chats: {},
      conversationHistory: {},
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

    // Verificar se todos os elementos necessários estão presentes
    const requiredElements = [
      createAgentBtn,
      createAgentModal,
      cancelAgentBtn,
      agentForm,
      openaiKeyInput,
      chatAgentSelect,
      messageInput,
      sendMessageBtn,
      resetChatBtn,
      chatMessages,
      createInstanceBtn,
      createInstanceModal,
      cancelInstanceBtn,
      connectInstanceBtn,
    ]

    requiredElements.forEach((element) => {
      if (!element) {
        throw new Error(`Elemento ${element} não encontrado`)
      }
    })

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
          objective: formData.get("objective"),
          targetAudience: formData.get("targetAudience"),
          specializations: formData.getAll("specializations"),
          basicQuestions: formData.get("basicQuestions"),
          genericExplanations: formData.get("genericExplanations"),
          suggestJurisprudence: formData.get("suggestJurisprudence"),
          persuasionLevel: formData.get("persuasionLevel"),
          communicationStyle: formData.getAll("communicationStyle"),
          personality: formData.getAll("personality"),
          humorLevel: formData.get("humorLevel"),
          complexityLevel: formData.get("complexityLevel"),
          clientNeed: formData.get("clientNeed"),
          hiringMethods: formData.getAll("hiringMethods"),
          autoInfo: formData.getAll("autoInfo"),
          maxQuestions: formData.get("maxQuestions"),
          forwarding: formData.get("forwarding"),
          suggestAlternatives: formData.get("suggestAlternatives"),
          benefits: formData.getAll("benefits"),
          restrictedTerms: formData.get("restrictedTerms"),
          formatting: formData.get("formatting"),
          informValues: formData.get("informValues"),
          valueHandling: formData.get("valueHandling"),
          differentials: formData.getAll("differentials"),
        }

        if (!agent.name || !agent.objective) {
          alert("Por favor, preencha todos os campos obrigatórios")
          return
        }

        state.agents.push(agent)
        state.conversationHistory[agent.id] = []
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
                          <img src="https://api.iconify.design/lucide:bot.svg" alt="${agent.name}" class="w-8 h-8">
                          <h3 class="text-xl font-semibold">${agent.name}</h3>
                      </div>
                      <p class="text-gray-600 mb-2">Objetivo: ${agent.objective}</p>
                      <p class="text-gray-600 mb-2">Público-alvo: ${agent.targetAudience}</p>
                      <p class="text-gray-600 mb-4">Especializações: ${agent.specializations.join(", ")}</p>
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

      // Preencher o formulário com os dados do agente
      Object.keys(agent).forEach((key) => {
        const input = form.querySelector(`[name="${key}"]`)
        if (input) {
          if (input.type === "select-multiple") {
            Array.from(input.options).forEach((option) => {
              option.selected = agent[key].includes(option.value)
            })
          } else {
            input.value = agent[key]
          }
        }
      })

      form.onsubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(form)

        const updatedAgent = {
          ...agent,
          name: formData.get("name"),
          objective: formData.get("objective"),
          targetAudience: formData.get("targetAudience"),
          specializations: formData.getAll("specializations"),
          basicQuestions: formData.get("basicQuestions"),
          genericExplanations: formData.get("genericExplanations"),
          suggestJurisprudence: formData.get("suggestJurisprudence"),
          persuasionLevel: formData.get("persuasionLevel"),
          communicationStyle: formData.getAll("communicationStyle"),
          personality: formData.getAll("personality"),
          humorLevel: formData.get("humorLevel"),
          complexityLevel: formData.get("complexityLevel"),
          clientNeed: formData.get("clientNeed"),
          hiringMethods: formData.getAll("hiringMethods"),
          autoInfo: formData.getAll("autoInfo"),
          maxQuestions: formData.get("maxQuestions"),
          forwarding: formData.get("forwarding"),
          suggestAlternatives: formData.get("suggestAlternatives"),
          benefits: formData.getAll("benefits"),
          restrictedTerms: formData.get("restrictedTerms"),
          formatting: formData.get("formatting"),
          informValues: formData.get("informValues"),
          valueHandling: formData.get("valueHandling"),
          differentials: formData.getAll("differentials"),
        }

        const index = state.agents.findIndex((a) => a.id === agentId)
        state.agents[index] = updatedAgent

        updateAgentsList()
        updateChatAgentSelect()
        form.reset()
        createAgentModal.classList.remove("active")
        localStorage.setItem("agents", JSON.stringify(state.agents))

        form.onsubmit = null
      }
    }

    window.deleteAgent = (agentId) => {
      if (!confirm("Tem certeza que deseja excluir este agente?")) return

      state.agents = state.agents.filter((a) => a.id !== agentId)
      delete state.conversationHistory[agentId]
      updateAgentsList()
      updateChatAgentSelect()
      localStorage.setItem("agents", JSON.stringify(state.agents))
    }

    window.startChatWithAgent = (agentId) => {
      const agent = state.agents.find((a) => a.id === agentId)
      if (!agent) return

      navigateToPage("chatsPage")

      if (chatAgentSelect) {
        chatAgentSelect.value = agent.id
        loadChatHistory(agent.id)
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

    function loadChatHistory(agentId) {
      if (!chatMessages) return

      chatMessages.innerHTML = ""
      const history = state.conversationHistory[agentId] || []
      history.forEach((msg) => {
        addMessageToChat(msg.role, msg.content)
      })
    }

    if (chatAgentSelect) {
      chatAgentSelect.addEventListener("change", () => {
        const agentId = Number.parseInt(chatAgentSelect.value)
        if (agentId) {
          loadChatHistory(agentId)
        }
      })
    }

    if (sendMessageBtn && messageInput && chatMessages) {
      sendMessageBtn.addEventListener("click", async () => {
        const message = messageInput.value.trim()
        const selectedAgentId = Number.parseInt(chatAgentSelect.value)
        const openaiKey = openaiKeyInput.value

        if (!message || !selectedAgentId || !openaiKey) {
          alert("Por favor, preencha todos os campos necessários")
          return
        }

        const agent = state.agents.find((a) => a.id === selectedAgentId)
        if (!agent) return

        messageInput.value = ""
        addMessageToChat("user", message)

        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
              model: agent.model || "gpt-4",
              messages: [
                {
                  role: "system",
                  content: `Você é um assistente com a seguinte personalidade: ${agent.personality}. ${agent.knowledge ? `Você tem o seguinte conhecimento específico: ${agent.knowledge}` : ""}`,
                },
                ...(state.conversationHistory[agent.id] || []),
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 2000,
            }),
          })

          const data = await response.json()
          if (data.error) {
            throw new Error(data.error.message)
          }

          const botResponse = data.choices[0].message.content
          addMessageToChat("assistant", botResponse)

          // Atualiza o histórico
          if (!state.conversationHistory[agent.id]) {
            state.conversationHistory[agent.id] = []
          }
          state.conversationHistory[agent.id].push(
            { role: "user", content: message },
            { role: "assistant", content: botResponse },
          )
        } catch (error) {
          addMessageToChat("error", `Erro: ${error.message}`)
        }
      })

      // Adiciona suporte a Enter para enviar mensagem
      messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          sendMessageBtn.click()
        }
      })
    }

    if (resetChatBtn) {
      resetChatBtn.addEventListener("click", () => {
        if (!confirm("Tem certeza que deseja resetar a conversa?")) return

        const selectedAgentId = Number.parseInt(chatAgentSelect.value)
        if (selectedAgentId) {
          state.conversationHistory[selectedAgentId] = []
          chatMessages.innerHTML = ""
          addMessageToChat("system", "Conversa resetada. Como posso ajudar?")
        }
      })
    }

    function addMessageToChat(role, content) {
      const messageDiv = document.createElement("div")
      messageDiv.className = `message ${role} p-3 mb-2 rounded-lg max-w-[80%] ${
        role === "user"
          ? "bg-primary text-white ml-auto"
          : role === "error"
            ? "bg-danger text-white"
            : role === "system"
              ? "bg-secondary text-white text-center mx-auto"
              : "bg-gray-100"
      }`

      // Renderiza markdown se não for mensagem de erro ou sistema
      if (role !== "error" && role !== "system") {
        const formattedContent = marked.parse(content)
        messageDiv.innerHTML = formattedContent

        // Adiciona botões de cópia para blocos de código
        messageDiv.querySelectorAll("pre").forEach((pre) => {
          const copyButton = document.createElement("button")
          copyButton.textContent = "Copiar"
          copyButton.className = "copy-button button secondary small absolute top-2 right-2"
          copyButton.addEventListener("click", () => {
            const code = pre.querySelector("code").textContent
            navigator.clipboard.writeText(code).then(() => {
              copyButton.textContent = "Copiado!"
              setTimeout(() => {
                copyButton.textContent = "Copiar"
              }, 2000)
            })
          })
          pre.style.position = "relative"
          pre.appendChild(copyButton)
        })
      } else {
        messageDiv.textContent = content
      }

      chatMessages.appendChild(messageDiv)
      chatMessages.scrollTop = chatMessages.scrollHeight
    }

    // Carregamento inicial
    const savedAgents = localStorage.getItem("agents")
    if (savedAgents) {
      state.agents = JSON.parse(savedAgents)
      state.agents.forEach((agent) => {
        if (!state.conversationHistory[agent.id]) {
          state.conversationHistory[agent.id] = []
        }
      })
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

    console.log("Aplicação inicializada com sucesso")
  } catch (error) {
    console.error("Erro na inicialização da aplicação:", error)
    document.body.innerHTML = `<h1>Ocorreu um erro ao inicializar a aplicação. Por favor, verifique o console para mais detalhes.</h1>`
  }
})
