import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `<div class="app-shell">
  <header class="hero">
    <div>
      <p class="eyebrow">Contact CRUD App</p>
      <h1>{{ title() }}</h1>
      <p>Use the form below to add, edit, and delete contacts in the in-memory store.</p>
    </div>
  </header>

  <section class="tabs">
    <button
      type="button"
      class="tab"
      [class.active]="activeTab() === 'form'"
      (click)="activeTab.set('form')"
    >
      Form
    </button>
    <button
      type="button"
      class="tab"
      [class.active]="activeTab() === 'contacts'"
      (click)="activeTab.set('contacts')"
    >
      Contacts
    </button>
  </section>

  <section class="grid-panel">
    <article class="panel form-panel" *ngIf="activeTab() === 'form'">
      <h2>{{ editId() ? 'Edit contact' : 'Add contact' }}</h2>
      <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)" novalidate autocomplete="off">
        <label>
          Name
          <input
            type="text"
            name="name"
            required
            [(ngModel)]="formData.name"
            placeholder="Enter name"
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            name="phone"
            required
            pattern="[0-9\s+\-()]*"
            [(ngModel)]="formData.phone"
            placeholder="Enter phone number"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            required
            [(ngModel)]="formData.email"
            placeholder="Enter email"
          />
        </label>

        <div class="actions">
          <button type="submit" [disabled]="contactForm.invalid">
            {{ editId() ? 'Update contact' : 'Save contact' }}
          </button>
          <button type="button" class="secondary" *ngIf="editId()" (click)="cancelEdit(contactForm)">
            Cancel
          </button>
        </div>
      </form>
    </article>

    <article class="panel list-panel" *ngIf="activeTab() === 'contacts'">
      <div class="list-heading">
        <h2>Contacts</h2>
        <span>{{ contacts().length }} saved</span>
      </div>

      <p class="empty" *ngIf="!contacts().length">No contacts yet. Add one to see it here.</p>

      <table *ngIf="contacts().length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let contact of contacts(); trackBy: trackByContact"
            class="clickable-row"
            (click)="editContact(contact)"
            tabindex="0"
          >
            <td>{{ contact.name }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.email }}</td>
            <td class="actions-cell">
              <button
                type="button"
                class="icon-button edit"
                aria-label="Edit contact"
                (click)="editContact(contact); $event.stopPropagation()"
              >
                <span class="icon">✏️</span>
                <span>Modify</span>
              </button>
              <button
                type="button"
                class="icon-button delete"
                aria-label="Delete contact"
                (click)="deleteContact(contact.id); $event.stopPropagation()"
              >
                <span class="icon">🗑️</span>
                <span>Delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</div>`,
  styles: [`
:host {
  display: block;
  min-height: 100dvh;
  background: #eef2ff;
  color: #0f172a;
  font-family: Inter, system-ui, sans-serif;
  padding: 1.5rem;
}

.app-shell {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero {
  background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  color: white;
}

.eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  opacity: 0.88;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3rem);
}

.hero p {
  margin-top: 1rem;
  line-height: 1.8;
  max-width: 36rem;
}

.grid-panel {
  display: grid;
  gap: 1.5rem;
}

.panel {
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08);
}

.form-panel h2,
.list-panel h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

label {
  display: grid;
  gap: 0.55rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid #cbd5e1;
  background: #f9fafb;
  color: #0f172a;
  font: inherit;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

button {
  min-height: 3rem;
  border: none;
  border-radius: 0.9rem;
  padding: 0 1.25rem;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  color: white;
  background: #4338ca;
  transition: transform 0.15s ease, background 0.15s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

button.secondary {
  background: #e2e8f0;
  color: #0f172a;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

thead th {
  text-align: left;
  padding: 0.95rem 0.75rem;
  color: #475569;
  font-weight: 700;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr {
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 0.95rem 0.75rem;
  vertical-align: middle;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

button.edit {
  background: #2563eb;
}

button.delete {
  background: #dc2626;
}

.empty {
  margin: 0;
  color: #475569;
}

.tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tab {
  background: #e2e8f0;
  border: none;
  border-radius: 0.85rem;
  padding: 0.85rem 1.25rem;
  font: inherit;
  cursor: pointer;
  color: #475569;
  transition: background 0.2s ease, color 0.2s ease;
}

.tab.active {
  background: #4338ca;
  color: white;
}

.tab:hover {
  background: #c7d2fe;
}

tbody tr.clickable-row {
  cursor: pointer;
  transition: background 0.15s ease;
}

tbody tr.clickable-row:hover {
  background: #f8fafc;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  min-width: 5rem;
}

.icon-button .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
}

@media (min-width: 768px) {
  .grid-panel {
    grid-template-columns: 1.05fr 1fr;
  }
}
`]
})
export class App {
  public title = signal('LPL');
  public contacts = signal<Contact[]>([]);
  public editId = signal<number | null>(null);
  public activeTab = signal<'form' | 'contacts'>('form');
  public formData = { name: '', phone: '', email: '' };
  private nextId = 1;

  protected onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const contact: Contact = {
      id: this.editId() ?? this.nextId++,
      name: this.formData.name.trim(),
      phone: this.formData.phone.trim(),
      email: this.formData.email.trim()
    };

    if (this.editId() === null) {
      this.contacts.update((list) => [...list, contact]);
    } else {
      this.contacts.update((list) =>
        list.map((item) => (item.id === contact.id ? contact : item))
      );
    }

    this.resetForm(form);
  }

  protected editContact(contact: Contact) {
    this.editId.set(contact.id);
    this.formData = {
      name: contact.name,
      phone: contact.phone,
      email: contact.email
    };
    this.activeTab.set('form');
  }

  protected deleteContact(id: number) {
    this.contacts.update((list) => list.filter((item) => item.id !== id));

    if (this.editId() === id) {
      this.editId.set(null);
      this.formData = { name: '', phone: '', email: '' };
    }
  }

  protected cancelEdit(form?: NgForm) {
    this.editId.set(null);
    if (form) {
      this.resetForm(form);
    } else {
      this.formData = { name: '', phone: '', email: '' };
    }
  }

  private resetForm(form: NgForm) {
    form.resetForm();
    this.editId.set(null);
    this.formData = { name: '', phone: '', email: '' };
  }

  protected trackByContact(_index: number, contact: Contact) {
    return contact.id;
  }
}
