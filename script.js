document.addEventListener('DOMContentLoaded', () => {
    // Login
    const formLogin = document.getElementById('formLogin');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();

        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        // Credenciais de exemplo
        const userValido = 'admin';
        const senhaValida = 'admin';

        if (login === '' || password === '') {
            alert('Por favor, preencha todos os campos.');
        } else if (login === userValido && password === senhaValida) {
            alert('Login bem-sucedido! Redirecionando para a página inicial.');
            window.location.href = 'home.html';
        } else {
            alert('Login ou senha incorretos. Tente novamente.');
        }
    });

    // Atualização do Ano no Rodapé (Para todas as páginas)
    const spanAno = document.getElementById('anoAtual');
    if (spanAno) {
        const dataAtual = new Date();
        spanAno.textContent = dataAtual.getFullYear();
    }
    
    // Formulário de Funcionários
    const form = document.getElementById('formCadastroFuncionario');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const pageTitle = document.querySelector('header h1');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;

    // Função de Máscara para CPF
    function formatarCPF(valor) {
        valor = valor.replace(/\D/g, "");

        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    }

    // Função de Máscara para Telefone
    function formatarTelefone(valor) {
        valor = valor.replace(/\D/g, "");
        if (valor.length > 10) {
            valor = valor.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1)$2-$3");
        }
        return valor;
    }

    // Formatar CPF em tempo real
    if (cpfInput) {
        cpfInput.addEventListener('input', (event) => {
            let valorFormatado = formatarCPF(event.target.value);
            if (valorFormatado.length > 14) {
                valorFormatado = valorFormatado.substring(0, 14);
            }
            event.target.value = valorFormatado;
        });
    }

    // Formatar Telefone em tempo real
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (event) => {
            event.target.value = formatarTelefone(event.target.value);
        });
    }

    // Carregar funcionário para edição ou para novo cadastro
    if (form && pageTitle && submitButton) {
        const urlParams = new URLSearchParams(window.location.search);
        const funcionarioId = urlParams.get('id');

        if (funcionarioId) {
            pageTitle.textContent = 'Editar Funcionário';
            submitButton.textContent = 'Salvar Alterações';

            let funcionarios = JSON.parse(localStorage.getItem('funcionariosCadastrados')) || [];
            const funcionarioParaEditar = funcionarios.find(func => func.id === funcionarioId);

            if (funcionarioParaEditar) {
                document.getElementById('cpf').value = funcionarioParaEditar.cpf;
                document.getElementById('nome').value = funcionarioParaEditar.nome;
                document.getElementById('sobrenome').value = funcionarioParaEditar.sobrenome;
                document.getElementById('telefone').value = funcionarioParaEditar.telefone;
                document.getElementById('cargo').value = funcionarioParaEditar.cargo;
                document.getElementById('departamento').value = funcionarioParaEditar.departamento;
                document.getElementById('dataContratacao').value = funcionarioParaEditar.dataContratacao;

                // Em modo de edição, o CPF é apenas visualização e não pode ser alterado
                cpfInput.setAttribute('readonly', true);
                cpfInput.style.backgroundColor = '#e9e9e9';
            } else {
                alert('Funcionário não encontrado para edição.');
                window.location.href = 'formFuncionarios.html';
            }
        } else {
            // Modo de Novo Cadastro
            pageTitle.textContent = 'Cadastro de Funcionários';
            submitButton.textContent = 'Cadastrar Funcionário';
            cpfInput.removeAttribute('readonly');
            cpfInput.style.backgroundColor = '';
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Validação de campos obrigatórios
            const camposObrigatorios = ['cpf', 'nome', 'sobrenome', 'cargo', 'departamento', 'dataContratacao'];
            for (const campoId of camposObrigatorios) {
                const input = document.getElementById(campoId);
                if (!input.value.trim()) {
                    alert(`O campo '${input.previousElementSibling.textContent.replace(':', '')}' é obrigatório.`);
                    input.focus();
                    return;
                }
            }

            // Validação de CPF (Exige exatamente 14 caracteres)
            const cpfValor = cpfInput.value.trim();
            const cpfLimpo = cpfValor.replace(/\D/g, "");

            if (cpfValor.length !== 14 || cpfLimpo.length !== 11) {
                alert('Por favor, insira um CPF válido com 11 dígitos.');
                cpfInput.focus();
                return;
            }

            // Validação de Telefone (formato e comprimento exato)
            const telefoneLimpo = telefoneInput.value.replace(/\D/g, "");

            // Se o campo não estiver vazio, exige o formato (DD)NNNNN-NNNN
            if (telefoneInput.value.trim() !== '' && !(/^\(\d{2}\)\d{5}-\d{4}$/.test(telefoneInput.value))) {
                alert('Por favor, insira um número de telefone válido no Formato (DD)NNNNN-NNNN');
                telefoneInput.focus();
                return;
            }

            let funcionarios = JSON.parse(localStorage.getItem('funcionariosCadastrados')) || [];

            if (funcionarioId) {
                const funcIndex = funcionarios.findIndex(func => func.id === funcionarioId);
                if (funcIndex > -1) {
                    funcionarios[funcIndex].nome = document.getElementById('nome').value;
                    funcionarios[funcIndex].sobrenome = document.getElementById('sobrenome').value;
                    funcionarios[funcIndex].telefone = telefoneInput.value;
                    funcionarios[funcIndex].cargo = document.getElementById('cargo').value;
                    funcionarios[funcIndex].departamento = document.getElementById('departamento').value;
                    funcionarios[funcIndex].dataContratacao = document.getElementById('dataContratacao').value;

                    localStorage.setItem('funcionariosCadastrados', JSON.stringify(funcionarios));
                    alert('Funcionário atualizado com sucesso!');
                    window.location.href = 'listar-funcionarios.html';
                } else {
                    alert('Erro: Funcionário não encontrado para atualização.');
                }
            } else {
                const cpfExistente = funcionarios.some(func => func.cpf.replace(/\D/g, "") === cpfLimpo);
                if (cpfExistente) {
                    alert('Erro: Já existe um funcionário cadastrado com este CPF.');
                    cpfInput.focus();
                    return;
                }

                const id = Date.now().toString();

                const funcionario = {
                    id: id,
                    cpf: cpfValor,
                    nome: document.getElementById('nome').value,
                    sobrenome: document.getElementById('sobrenome').value,
                    telefone: telefoneInput.value,
                    cargo: document.getElementById('cargo').value,
                    departamento: document.getElementById('departamento').value,
                    dataContratacao: document.getElementById('dataContratacao').value
                };

                funcionarios.push(funcionario);
                localStorage.setItem('funcionariosCadastrados', JSON.stringify(funcionarios));

                alert('Funcionário cadastrado com sucesso!');
                form.reset();
            }
        });
    }

    // Lista de Funcionários
    const listaFuncionariosDiv = document.getElementById('listaFuncionarios');
    const limparDadosBtn = document.getElementById('limparDados');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Exibir/atualizar a lista de funcionários
    function exibirFuncionarios(filtro = '') {
        const funcionariosSalvos = localStorage.getItem('funcionariosCadastrados');
        let funcionarios = funcionariosSalvos ? JSON.parse(funcionariosSalvos) : [];

        if (filtro) {
            const filtroLowerCase = filtro.toLowerCase();
            funcionarios = funcionarios.filter(func =>
                func.nome.toLowerCase().includes(filtroLowerCase) ||
                func.sobrenome.toLowerCase().includes(filtroLowerCase) ||
                func.cpf.toLowerCase().includes(filtroLowerCase) ||
                func.cargo.toLowerCase().includes(filtroLowerCase) ||
                func.departamento.toLowerCase().includes(filtroLowerCase)
            );
        }

        if (listaFuncionariosDiv) {
            if (funcionarios.length > 0) {
                let tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>CPF</th>
                                <th>Nome Completo</th>
                                <th>Telefone</th>
                                <th>Cargo</th>
                                <th>Departamento</th>
                                <th>Data Contratação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                funcionarios.forEach(func => {
                    const nomeCompleto = `${func.nome} ${func.sobrenome}`;
                    tableHTML += `
                        <tr data-id="${func.id}" class="funcionario-row">
                            <td data-label="CPF">${func.cpf}</td>
                            <td data-label="Nome Completo">${nomeCompleto}</td>
                            <td data-label="Telefone">${func.telefone}</td>
                            <td data-label="Cargo">${func.cargo}</td>
                            <td data-label="Departamento">${func.departamento}</td>
                            <td data-label="Data Contratação">${func.dataContratacao}</td>
                            <td data-label="Ações" class="acoes">
                                <button class="btn-editar" data-id="${func.id}">Editar</button>
                                <button class="btn-excluir" data-id="${func.id}">Excluir</button>
                            </td>
                        </tr>
                    `;
                });
                tableHTML += `
                            </tbody>
                    </table>
                `;
                listaFuncionariosDiv.innerHTML = tableHTML;
            } else {
                listaFuncionariosDiv.innerHTML = '<p class="empty-message">Nenhum funcionário encontrado com o filtro aplicado.</p>';
            }
        }
    }

    // Event listeners para a lista de funcionários
    if (listaFuncionariosDiv) {
        listaFuncionariosDiv.addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('btn-excluir')) {
                const idParaExcluir = target.dataset.id;
                if (confirm('Tem certeza que deseja excluir este funcionário?')) {
                    let funcionarios = JSON.parse(localStorage.getItem('funcionariosCadastrados')) || [];
                    funcionarios = funcionarios.filter(func => func.id !== idParaExcluir);
                    localStorage.setItem('funcionariosCadastrados', JSON.stringify(funcionarios));
                    exibirFuncionarios();
                    alert('Funcionário excluído com sucesso!');
                }
            } else if (target.classList.contains('btn-editar')) {
                const idParaEditar = target.dataset.id;
                window.location.href = `formFuncionarios.html?id=${idParaEditar}`;
            } else {
                const row = target.closest('.funcionario-row');
                if (row && !target.classList.contains('btn-editar') && !target.classList.contains('btn-excluir')) {
                    const idParaDetalhes = row.dataset.id;
                    window.location.href = `dados-funcionario.html?id=${idParaDetalhes}`;
                }
            }
        });

        if (limparDadosBtn) {
            limparDadosBtn.addEventListener('click', () => {
                const funcionariosSalvos = localStorage.getItem('funcionariosCadastrados');
                const funcionarios = funcionariosSalvos ? JSON.parse(funcionariosSalvos) : [];

                if (funcionarios.length === 0) {
                    alert('Não há funcionários cadastrados para remover.');
                    return;
                }

                if (confirm('Tem certeza que deseja apagar TODOS os funcionários cadastrados? Esta ação é irreversível.')) {
                    localStorage.removeItem('funcionariosCadastrados');
                    exibirFuncionarios();
                    alert('Todos os dados foram removidos!');
                }
            });
        }

        if (searchInput && searchButton) {
            searchInput.addEventListener('input', () => {
                exibirFuncionarios(searchInput.value);
            });
            searchButton.addEventListener('click', () => {
                exibirFuncionarios(searchInput.value);
            });

            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    exibirFuncionarios(searchInput.value);
                }
            });
        }

        exibirFuncionarios();
    }

    // Detalhes do Funcionário
    const dadosFuncionarioDiv = document.getElementById('dadosFuncionario');
    if (dadosFuncionarioDiv && window.location.pathname.includes('dados-funcionario.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const funcionarioId = urlParams.get('id');

        if (funcionarioId) {
            const funcionarios = JSON.parse(localStorage.getItem('funcionariosCadastrados')) || [];
            const funcionario = funcionarios.find(func => func.id === funcionarioId);

            if (funcionario) {
                const emptyMessage = dadosFuncionarioDiv.querySelector('.empty-message');
                if (emptyMessage) {
                    emptyMessage.remove();
                }

                dadosFuncionarioDiv.innerHTML = `
                    <h3>Dados Pessoais:</h3>
                    <p><strong>CPF:</strong> ${funcionario.cpf}</p>
                    <p><strong>Nome Completo:</strong> ${funcionario.nome} ${funcionario.sobrenome}</p>
                    <p><strong>Telefone:</strong> ${funcionario.telefone}</p>

                    <h3>Dados Profissionais:</h3>
                    <p><strong>Cargo:</strong> ${funcionario.cargo}</p>
                    <p><strong>Departamento:</strong> ${funcionario.departamento}</p>
                    <p><strong>Data de Contratação:</strong> ${funcionario.dataContratacao}</p>
                `;
            } else {
                dadosFuncionarioDiv.innerHTML = '<p class="empty-message">Funcionário não encontrado.</p>';
            }
        } else {
            dadosFuncionarioDiv.innerHTML = '<p class="empty-message">ID do funcionário não fornecido.</p>';
        }
    }
});