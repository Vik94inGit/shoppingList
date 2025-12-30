export const enTranslations = {
  main: {
    common: {
      me: "Me",
      loading: "Loading…",
      loadingUser: "Loading user session...",
      back: "Back",
      settings: "Settings",
      filter: "Filter",
      language: "Language",
      theme: "Theme",
      done: "Done",
      pending: "Pending",
      showChart: "Show diagram",
      theme: "theme",
      dark: "dark",
      light: "light",
    },
    components: {
      itemForm: {
        placeholder: {
          name: "Item name",
          count: "Quantity",
        },
        submit: "Save",
        create: "Add",
        cancel: "Cancel",
        loading: "Saving...",
        alert: {
          nameRequired: "Please enter an item name.",
        },
      },
      createItem: {
        placeholder: {
          name: "Item name",
          count: "Quantity",
        },
        addButton: "Add",
        loading: "Adding...",
        alert: {
          nameInvalid: "Name must be between 1 and 100 characters.",
          countInvalid: "Quantity must be a number between 1 and 99,999.",
          addFailed: "Failed to add item. Please try again.",
        },
      },
      invite: {
        title: "Invite New Member (Owner Only)",
        formAria: "Form to invite a new member to the shopping list",
        fields: {
          name: "User Name",
          email: "Email Address",
        },
        placeholders: {
          name: "e.g. Peter",
          email: "peter@example.com",
        },
        submit: "Send Invitation",
        loading: "Sending...",
        success: "{{name}} has been added!",
        errors: {
          required: "Please enter both name and email",
          default: "Failed to add member",
          alreadyMember: "User is already in the list",
          notRegistered: "User is not registered – cannot add",
        },
      },
      shoppingListCard: {
        items_count1: "item",
        items_few: "items",
        items_count2: "items",
        archived_label: "Archived",
        active_label: "Archive?",
      },
      itemList: {
        emptyMessage:
          "The list is empty, or all items are hidden by the filter.",
      },
      createItem: {
        placeholder: {
          name: "Item name",
          count: "Count",
        },
        addButton: "Add",
        loading: "Adding...",
      },
      itemRow: {
        resolved: "done",
        toggleResolved: "Mark as resolved/unresolved",
        menu: {
          open: "Open item menu",
          edit: "Edit",
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
        },
        editPlaceholder: {
          name: "Item name",
        },
        confirmDelete: 'Really delete "{name}"?',
        alert: {
          updateFailed: "Failed to update item.",
          deleteFailed: "Failed to delete item.",
        },
      },
    },
    pages: {
      shoppingList: {
        emptyMessage: "Shoppig list is empty now!",
        deleteConfirm:
          "Do you really want to delete this shopping list? This action cannot be undone.",
        deleteError: "Deletion failed. Please try again.",
        deleteAria: "Delete list",
        notFound: "List not found.",
        backToHome: "Back to lists",
        menu: "Open menu",
        filterLabel: "Show items:",
        filters: {
          all: "All items",
          unsolved: "Unsolved only",
          solved: "Solved only",
        },
        members: {
          title: "Učastniky",
          remove: "Remove",
          removeUserAria: "Remove {userName}",
          leave: "Leave",
          leaveListAria: "Leave this list",
        },
        editMembers: "Edit members",
        resetList: "Reset list to default",
        confirmReset:
          "Really reset the list to default state? All changes will be lost.",
        membersTitle: "List Members",
      },
      shoppingLists: {
        title: "My Shopping Lists",
        pleaseLogin: "Please log in to view your lists.",
        menu: "Open menu",
        confirmReset:
          "Do you really want to reset all lists to default? All changes will be lost.",
        newList: "New List",
        reset: "Reset",
        filters: {
          all: "All",
          owned: "My Lists",
          shared: "Shared with Me",
          archived: "Archived Lists",
        },
        empty: {
          all: "No lists yet.",
          owned: "You haven't created any lists yet.",
          shared: "No one has shared a list with you yet.",
          archived: "No archived lists.",
        },
      },
      login: {
        loginButton: "Login",
        shoppingList: "Shopping List",
        password: "Password",
        registerMessage1: "Don't have an account?",
        registerMessage2: "Register here",
        loginMes1: "Logging in...",
        loginMes2: "Login",
      },
      logout: "Log out",
      register: {
        title: "Create Account",
        fields: {
          name: "Name",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm Password",
        },
        placeholders: {
          name: "Your name",
          email: "your@email.com",
          password: "••••••••",
          confirmPassword: "••••••••",
        },
        submit: "Register",
        loading: "Creating account...",
        success: "Registration successful! Redirecting...",
        alreadyHaveAccount: "Already have an account?",
        loginLink: "Login here",
        errors: {
          required: "All fields are required",
          passwordMismatch: "Passwords do not match",
          passwordLength: "Password must be at least 6 characters",
          registrationFailed: "Registration failed",
        },
      },
    },
  },
};
