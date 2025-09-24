import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactForm } from "@/components/ContactForm";
import { ContactCard } from "@/components/ContactCard";
import { Contact } from "@/types/contact";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createContact, deleteContact, getAllContacts } from "@/actions/dashboardActions";

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      const allContacts = await getAllContacts();
      setContacts(allContacts);
    }

    fetchContacts();
  }, [contacts]);


  const handleSaveContact = async (contactData: Omit<Contact, "id"> & { id?: string }) => {
    try {
      const response = await createContact(contactData.telefone, contactData.nome);
      if (response.status === 200) {
        setContacts(prev => [...prev, response.data]);
        toast({
          title: "Contato atualizado",
          description: "O contato foi atualizado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar contato",
        description: "O contato não foi atualizado com sucesso.",
      })
    }
    // Editing existing contact
    // setContacts(prev =>
    //   prev.map(contact =>
    //     contact.id === contactData.id ? { ...contactData, id: contactData.id } as Contact : contact
    //   )
    // );
    //   toast({
    //     title: "Contato atualizado",
    //     description: "O contato foi atualizado com sucesso.",
    //   });
    // } else {
    //   // Adding new contact
    //   const newContact: Contact = {
    //     ...contactData,
    //     id: crypto.randomUUID(),
    //   };
    //   setContacts(prev => [...prev, newContact]);
    //   toast({
    //     title: "Contato adicionado",
    //     description: "O novo contato foi adicionado com sucesso.",
    //   });
    // }
    setEditingContact(undefined);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = async (telefone: string) => {
    // setContacts(prev => prev.filter(contact => contact.id !== id));
    await deleteContact(telefone);
    setContacts(prev => prev.filter(contact => contact.telefone !== telefone));
    toast({
      title: "Contato removido",
      description: "O contato foi removido com sucesso.",
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(undefined);
  };


  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    const nameInitials = contact.nome.split(' ').map(word => word.charAt(0)).join('').toLowerCase();
    return contact.telefone.toLowerCase().includes(searchLower) || 
           contact.nome.toLowerCase().includes(searchLower) ||
           nameInitials.includes(searchLower);
  });

  const handleDeleteAllFiltered = async () => {
    if (filteredContacts.length === 0) return;
    
    try {
      for (const contact of filteredContacts) {
        await deleteContact(contact.telefone);
      }
      setContacts(prev => prev.filter(contact => !filteredContacts.includes(contact)));
      toast({
        title: "Contatos removidos",
        description: `${filteredContacts.length} contatos foram removidos com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover contatos",
        description: "Alguns contatos não puderam ser removidos.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Gerenciador de Contatos</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Contato
          </Button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Pesquisar por telefone, nome ou iniciais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {filteredContacts.length > 0 && filteredContacts.length < contacts.length && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {filteredContacts.length} contatos encontrados
              </span>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteAllFiltered}
              >
                Deletar Todos Filtrados
              </Button>
            </div>
          )}
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nenhum contato cadastrado</h2>
            <p className="text-muted-foreground mb-4">
              Adicione seu primeiro contato para começar.
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Contato
            </Button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nenhum contato encontrado</h2>
            <p className="text-muted-foreground mb-4">
              Nenhum contato foi encontrado com o telefone pesquisado.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}

        <ContactForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveContact}
          contact={editingContact}
        />
      </div>
    </div>
  );
};

export default Index;
