import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/ContactForm";
import { ContactCard } from "@/components/ContactCard";
import { Contact } from "@/types/contact";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const { toast } = useToast();

  const handleSaveContact = (contactData: Omit<Contact, "id"> & { id?: string }) => {
    if (contactData.id) {
      // Editing existing contact
      setContacts(prev =>
        prev.map(contact =>
          contact.id === contactData.id ? { ...contactData, id: contactData.id } as Contact : contact
        )
      );
      toast({
        title: "Contato atualizado",
        description: "O contato foi atualizado com sucesso.",
      });
    } else {
      // Adding new contact
      const newContact: Contact = {
        ...contactData,
        id: crypto.randomUUID(),
      };
      setContacts(prev => [...prev, newContact]);
      toast({
        title: "Contato adicionado",
        description: "O novo contato foi adicionado com sucesso.",
      });
    }
    setEditingContact(undefined);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contato removido",
      description: "O contato foi removido com sucesso.",
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(undefined);
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
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
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
