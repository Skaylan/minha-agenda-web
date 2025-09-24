export async function createContact(telefone: string, nome: string) {
    const response = await fetch(`http://localhost:5000/api/v1/adicionar_contato`, {
        method: 'POST',
        body: JSON.stringify({ "telefone": String(telefone), "nome": String(nome) }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

export async function getAllContacts() {
    const response = await fetch(`http://localhost:5000/api/v1/listar_contatos`);
    const data = await response.json();
    return data;
}

export async function deleteContact(telefone: string) {
    const response = await fetch(`http://localhost:5000/api/v1/remover_contato`, {
        method: 'DELETE',
        body: JSON.stringify({ "telefone": String(telefone) }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}


export async function updateContact(telefone: string, nome: string) {
    const response = await fetch(`http://localhost:5000/api/v1/editar_contato`, {
        method: 'PUT',
        body: JSON.stringify({ "telefone": String(telefone), "nome": String(nome) }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}