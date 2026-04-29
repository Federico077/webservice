/**
 * script.js - Gestione logica per l'applicazione Contatti
 */

const risposta = document.getElementById("risposta");
const tabellaCorpo = document.getElementById("tabella");

// Carica la lista utenti non appena la pagina è pronta
document.addEventListener("DOMContentLoaded", caricaUtenti);

/**
 * Invia i dati al server tramite API POST
 */
function inviaDati() {
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    // Validazione base lato client
    if (!nome || !email) {
        mostraMessaggio("Compila tutti i campi richiesti", "orange");
        return;
    }

    fetch("api/salva.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email })
    })
    .then(res => res.json())
    .then(data => {
        if (data.errore) {
            mostraMessaggio(data.messaggio, "#ef4444"); // Colore errore (rosso)
        } else {
            mostraMessaggio(data.messaggio, "#10b981"); // Colore successo (verde)
            // Pulisce i campi
            nomeInput.value = "";
            emailInput.value = "";
            // Aggiorna la tabella
            caricaUtenti();
        }
    })
    .catch(() => {
        mostraMessaggio("Errore di connessione al server", "#ef4444");
    });
}

/**
 * Recupera la lista degli utenti dal database
 */
function caricaUtenti() {
    fetch("api/lista.php")
    .then(res => res.json())
    .then(data => {
        tabellaCorpo.innerHTML = ""; // Svuota la tabella prima di ricaricare

        if (!data || data.length === 0) {
            tabellaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748b;">Nessun utente registrato</td></tr>`;
            return;
        }

        data.forEach(u => {
            const tr = document.createElement("tr");

            // Cella Nome (Safe text)
            const tdNome = document.createElement("td");
            tdNome.textContent = u.nome; 
            
            // Cella Email (Safe text)
            const tdEmail = document.createElement("td");
            tdEmail.textContent = u.email;

            // Cella Data
            const tdData = document.createElement("td");
            tdData.textContent = u.data_creazione;

            // Cella Azione (Bottone Elimina)
            const tdAzione = document.createElement("td");
            tdAzione.style.textAlign = "center";
            
            const btnElimina = document.createElement("button");
            btnElimina.className = "btn-delete";
            btnElimina.innerHTML = '<i class="fas fa-trash-alt"></i>';
            btnElimina.title = "Elimina utente";
            btnElimina.onclick = () => elimina(u.id);
            
            tdAzione.appendChild(btnElimina);

            // Assemblaggio riga
            tr.appendChild(tdNome);
            tr.appendChild(tdEmail);
            tr.appendChild(tdData);
            tr.appendChild(tdAzione);
            
            tabellaCorpo.appendChild(tr);
        });
    })
    .catch(err => console.error("Errore nel caricamento utenti:", err));
}

/**
 * Elimina un utente tramite ID
 */
function elimina(id) {
    if (!confirm("Sei sicuro di voler eliminare questo contatto?")) return;

    fetch("api/elimina.php?id=" + id)
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            caricaUtenti();
        } else {
            alert("Impossibile eliminare l'utente.");
        }
    })
    .catch(err => console.error("Errore eliminazione:", err));
}

/**
 * Helper per mostrare messaggi di feedback all'utente
 */
function mostraMessaggio(testo, colore) {
    risposta.innerText = testo;
    risposta.style.color = colore;
    
    // Scompare dopo 4 secondi
    setTimeout(() => {
        risposta.innerText = "";
    }, 4000);
}