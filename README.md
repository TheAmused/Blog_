**Wymagania:**
Node.js i npm
Uruchomiona baza danych MongoDB

### 1. Konfiguracja Bazy Danych (Wymagane!)

Przed uruchomieniem serwera API musisz skonfigurować połączenie z MongoDB:

1. Wejdź do folderu `api`.
2. Znajdź plik o nazwie `config.example.ts`.
3. Zmień jego nazwę na **`config.ts`.**
4. Otwórz plik i dostosuj wartości:
   - `uri`: Wpisz adres swojej bazy danych (lokalnej lub z chmury MongoDB Atlas).
   - `jwtSecret`: (Opcjonalnie) Zmień sekretny klucz do generowania tokenów.

### 2. Uruchomienie Backendu (API)

```bash
cd api
npm install
npm run watch
```

### 3. Uruchomienie Frontendu (Angular)

```bash
cd blog
npm install
npx ng serve
```
