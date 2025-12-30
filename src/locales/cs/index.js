export const csTranslations = {
  main: {
    common: {
      me: "Já",
      loading: "Načítání…",
      loadingUser: "Načítání uživatelské relace...",
      back: "Zpět",
      settings: "Nastavení",
      filter: "Zobrazení",
      language: "Jazyk",
      theme: "Téma",
      done: "Hotovo",
      pending: "Zbývá",
      showChart: "Ukazat graf",
      theme: "Téma",
      dark: "tmava",
      light: "světla",
    },
    components: {
      createList: {
        create: "Vytvořit nový seznam",
        cancel: " Zrušit",
        name: "Název seznamu",
        createList: " Vytvořit seznam",
        prompt: "Např. Týdenní nákup",
      },
      itemForm: {
        placeholder: {
          name: "Název položky",
          count: "Počet",
        },
        submit: "Uložit",
        create: "Přidat",
        cancel: "Zrušit",
        loading: "Ukládám...",
        alert: {
          nameRequired: "Zadejte prosím název položky.",
        },
      },
      itemList: {
        emptyMessage:
          "Seznam je prázdný, nebo jsou všechny položky skryty filtrem.",
      },
      invite: {
        title: "Pozvat nového člena",
        formAria: "Formulář pro pozvání nového člena do seznamu",
        fields: {
          name: "Jméno uživatele",
          email: "Emailová adresa",
        },
        placeholders: {
          name: "např. Petr",
          email: "petr@example.com",
        },
        submit: "Pozvat",
        loading: "Odesílám...",
        success: "{{name}} byl přidán!",
        errors: {
          required: "Zadejte prosím jméno i email",
          default: "Nepodařilo se přidat člena",
          alreadyMember: "Uživatel je již v seznamu",
          notRegistered: "Uživatel není registrovaný – nelze přidat",
        },
      },
      createItem: {
        placeholder: {
          name: "Název položky",
          count: "Počet",
        },
        addButton: "Přidat",
        loading: "Přidávám...",
        alert: {
          nameInvalid: "Název musí mít 1 až 100 znaků.",
          countInvalid: "Množství musí být číslo mezi 1 a 99 999.",
          addFailed: "Nepodařilo se přidat položku. Zkuste to znovu.",
        },
      },
      shoppingListCard: {
        items_count1: "položka",
        item_few: "položky",
        items_count2: "položek",
        archived_label: "Archivováno",
        active_label: "Archivovat?",
      },
      itemRow: {
        resolved: "hotovo",
        toggleResolved: "Označit jako vyřešené/nevyřešené",
        menu: {
          open: "Otevřít menu položky",
          edit: "Upravit",
          save: "Uložit",
          cancel: "Zrušit",
          delete: "Smazat",
        },
        editPlaceholder: {
          name: "Název položky",
        },
        confirmDelete: "Opravdu smazat „{name}“?",
        alert: {
          updateFailed: "Nepodařilo se aktualizovat položku.",
          deleteFailed: "Nepodařilo se smazat položku.",
        },
      },
    },
    pages: {
      shoppingList: {
        emptyMessage: "Zatím seznam je prázdný!",
        notFound: "Seznam nenalezen.",
        backToHome: "Zpět na seznamy",
        menu: "Otevřít menu",
        filterLabel: "Zobrazit položky:",
        members: {
          title: "Members",
          remove: "Odebrat",
          removeUserAria: "Odebrat {userName}",
          leave: "Opustit",
          leaveListAria: "Opustit tento seznam",
        },
        filters: {
          all: "Všechny položky",
          unsolved: "Nevyřešené",
          solved: "Vyřešené",
        },
        editMembers: "Upravit členy",
        resetList: "Resetovat seznam",
        confirmReset:
          "Opravdu chcete resetovat seznam na výchozí stav? Všechny změny budou ztraceny.",
        membersTitle: "Členové seznamu",
      },
      shoppingLists: {
        deleteConfirm:
          "Opravdu chcete smazat tento nákupní seznam? Tato akce je nevratná.",
        deleteError: "Smazání selhalo. Zkuste to prosím znovu.",
        deleteAria: "Smazat seznam",
        title: "Moje nákupní seznamy",
        pleaseLogin: "Pro zobrazení seznamů se prosím přihlaste.",
        menu: "Otevřít menu",
        confirmReset:
          "Opravdu chcete resetovat všechny seznamy na výchozí stav? Všechny změny budou ztraceny.",
        newList: "Nový seznam",
        reset: "Resetovat",
        filters: {
          all: "Všechny",
          owned: "Moje seznamy",
          shared: "Sdílené se mnou",
          archived: "Archivované seznamy",
        },
        members: {
          remove: "Odebrat",
          removeUserAria: "Odebrat {userName}",
          leave: "Opustit",
          leaveListAria: "Opustit tento seznam",
        },
        empty: {
          all: "Zatím žádné seznamy.",
          owned: "Zatím jste nevytvořili žádný seznam.",
          shared: "Nikdo vám zatím nesdílel žádný seznam.",
          archived: "Žádné archivované seznamy.",
        },
      },
      login: {
        loginButton: "Přihlásit se",
        shoppingList: "Seznam nákupu",
        password: "Heslo",
        registerMessage1: "Nemáte účet?",
        registerMessage2: "Zaregistrujte se zde",
        loginMes1: "Přihlašování...",
        loginMes2: "Přihlásit se",
      },
      logout: "Odhlásit se",
      register: {
        title: "Vytvořit účet",
        fields: {
          name: "Jméno",
          email: "Email",
          password: "Heslo",
          confirmPassword: "Potvrdit heslo",
        },
        placeholders: {
          name: "Vaše jméno",
          email: "vas@email.cz",
          password: "••••••••",
          confirmPassword: "••••••••",
        },
        submit: "Zaregistrovat se",
        loading: "Vytvářím účet...",
        success: "Registrace úspěšná! Přesměrovávám...",
        alreadyHaveAccount: "Již máte účet?",
        loginLink: "Přihlásit se zde",
        errors: {
          required: "Všechna pole jsou povinná",
          passwordMismatch: "Hesla se neshodují",
          passwordLength: "Heslo musí mít alespoň 6 znaků",
          registrationFailed: "Registrace selhala",
        },
      },
    },
  },
};
