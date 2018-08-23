const translationsEs = {
  es: {
    login: {
      form: {
        welcome: 'Welcome',
        to: 'Flight data processing and analysis software complex «Luch»',
        vendor: 'Aviation Technologies. We create future',
        userName: 'User name',
        authorize: 'Log in',
        password: 'Password',
        userUnexist: 'User unexist'
      }
    },
    flightsTree: {
      apply: 'Aplicar',
      toolbar: {
        flightList: 'lista de los vuelos'
      },
      menuDropdown: {
        fileMenu: 'Menú',
        expand: 'Expand',
        collapse: 'Collapse',
        delete: 'Borrar',
        export: 'Exportación',
        process: 'Editar',
        removeSelection: 'Cancelar asignación',
        exportCoordinates: 'Export coordinates',
        events: 'Events',
        params: 'Parameters',
        templates: 'Templates'
      },
      flightTitle: {
        performer: 'Perf.',
        bort: 'Bort',
        voyage: 'Flight',
        startCopyTime: 'Flight start time',
        departureAirport: 'Departure airport',
        arrivalAirport: 'Arrival airport',
      },
      flightControls: {
        confirm: 'Confirm flight deleting',
      },
      folderControls: {
        confirm: 'Confirm folder deleting',
      },
    },
    flightsTable: {
      toolbar: {
        flightList: 'lista de los vuelos'
      },
      menuDropdown: {
        fileMenu: 'Menú',
        delete: 'Borrar',
        export: 'Exportación',
        process: 'Editar',
        removeSelection: 'Cancelar asignación',
        exportCoordinates: 'Export coordinates',
        events: 'Events',
        params: 'Parameters',
        templates: 'Templates'
      },
      table: {
        bort: 'Bort',
        voyage: 'Flight',
        performer: 'Performer',
        startCopyTime: 'Flight start time',
        departureAirport: 'Departure airport',
        arrivalAirport: 'Arrival airport',
      },
    },
    uploadingPreview: {
      toolbar: {
        preview: 'Preview'
      }
    },
    settings: {
      list: {
        options: 'Conservar',
        save: 'Save',
        printTableStep: 'Paso mesa de impresión',
        mainChartColor: 'Color principal fondo de la carta',
        lineWidth: 'Сhart líneas de ancho',
        flightShowAction: 'Flight show action',
        pointsMaxCount: 'Max points count on chart'
      }
    },
    flightStatistics: {
      toolbar: {
        aggregatedStatistics: 'Aggregated statistics',
      },
      flightFilter: {
        flightInfoFilter: 'Filter by flight info',
        apply: 'Aplicar',
        fdrType: 'Tipo de registro',
        bort:'Número de aeronaves',
        voyage:'Vuelo',
        departureFromDate:'Departure from date',
        departureToDate:'Departure to date',
        departureAirport: 'Aeropuerto de salida',
        arrivalAirport: 'Aterrizaje de aeropuertos',
      },
      paramsFilter: {
        apply: 'Aplicar',
        putFlightFilter: 'Put flight filter',
        noMonitoredParamsOnSpecifyedFilter: 'No monitored params on specifyed filter',
        monitoredParameters: 'Monitored parameters',
      },
      values: {
        results: 'Report',
        setParamsForReportGenerating: 'Set params for report generating',
        noDataToGenerateReport: 'No data to generate report'
      },
      valuesRow: {
        title: 'Param',
        count: 'Count',
        min: 'Min',
        avg: 'Avg',
        sum: 'Sum',
        max: 'Max',
      }
    },
    flightTemplates: {
      item: {
        events: 'Events',
        default: 'Default',
        last: 'Last viewed'
      }
    },
    flightEvents: {
      formPrint: {
        grayscale: 'Grayscale'
      },
      flightComment: {
        commanderAdmitted: 'Captain admitted',
        aircraftAllowed: 'Aircraft allowed',
        generalAdmission: 'General admission',
        save: 'Save'
      },
      title: {
        fdrName: 'FDR',
        bort: 'A/C',
        voyage: 'Flight',
        startCopyTime: 'The time and date of the flight',
        departureAirport: 'Departure Airport',
        arrivalAirport: 'Arrival Airport',
        centringto: 'Center of Gravity Takeoff',
        centringlndg: 'Center of Gravity Landing',
        weightto: 'Weight Takeoff',
        weightlndg: 'Weight Landing',
        tto: 'Тemperature Takeoff',
        capitan: 'F/O',
        route: 'Route',
        centring: 'Center of Gravity',
      },
      list: {
        processingNotPerformed: 'Processing not performed',
        noEvents: 'Events not found'
      },
      collapse: {
        eventCodeMask000: "Technological posts",
        eventCodeMask001: "Piloting equipment control",
        eventCodeMask002: "Health control",
        eventCodeMask003: "Information messages",
      },
      contentHeader: {
        start: 'Start',
        end: 'End',
        duration: 'Duration',
        code: 'Code',
        eventName: 'Name',
        algorithm: 'Algorithm',
        aditionalInfo: 'Aditional info',
        reliability: 'Reliability',
        comment: 'Comment',
      }
    },
    calibration: {
      toolbar: {
        title: 'Calibration'
      },
      table: {
        fdr: 'FDR',
        name: 'Name',
        dateCreation: 'Creation Date',
        dateLastEdit: 'Last Edit'
      },
      create: 'Create',
      creationForm: 'Calibration Creation Form',
      for: 'for',
      paramName: 'Name',
      paramCode: 'Code',
      paramChannels: 'Channels',
      valueAdd: 'Add',
      save: 'Save',
      update: 'Update',
      list: 'To List',
      unexist: 'No calibrations',
      controls: 'Controls',
      edit: 'Edit',
      delete: 'Delete',
      inputName: 'Please input name to save',
    },
    calibrationForm: {
      toolbar: {
        title: 'Calibration for FDR %{fdrName}'
      },
      spreadsheetTitle: {
        code: 'Code',
        physics: 'Physics'
      },
      spreadsheet: {
        addButton: 'Add row'
      },
      param: {
        code: 'Code',
        name: 'Name (dim)',
        channels: 'Channels',
        minValue: 'Min value',
        maxValue: 'Max value',
        deviationFromStandardView: 'Deviation from standard view'
      }
    },
    flightUploader: {
      upload: 'Upload',
      filesList: 'Files list',
    },
    usersTable: {
      toolbar: {
        list: 'Users list',
      },
      table: {
        login: 'Login',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        lang: 'Language',
        role: 'Role',
        company: 'Organization',
        logo: 'Logo',
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        list: 'List',
        save: 'Save',
        confimUserDeleting: 'Confirm user deleting'
      }
    },
    userForm: {
      toolbar: {
        create: 'Create new user',
        edit: 'Edit user'
      },
      form: {
        login: 'Login',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        pass: 'Password',
        repeatPass: 'Repeat password',
        company: 'Organization',
        role: 'Role',
        logo: 'Logo',
        avaliableFdrs: 'Set avaliable FDRs',
        chooseFile: 'Choose logo',
        notAllNecessarySent: 'Not all necessary params filled (marked by *)',
        alreadyExist: 'User with same login already exist',
        creationError: 'User creation error'
      },
      roleRadio: {
        admin: 'Admin',
        moderator: 'Moderator',
        user: 'User'
      }
    },
    userActivity: {
      toolbar: {
        list: 'User activity',
      },
      table: {
        action: 'Action',
        status: 'Status',
        message: 'Response message',
        date: 'Date'
      }
    },
    supervision: {
      verticalToolbar: {
        connectionParams: 'Connection params',
        fdrType: 'FDR type',
        start: 'Run',
        stop: 'Stop',
        save: 'Save',
      },
      dataSource: {
        kvViaUdp: 'KV via UDP',
        file: 'File',
        fileViaUdp: 'File via UDP',
        connectionType: 'Connection type',
        sourceIps: 'Sources IP addresses',
        addSource: 'Add source',
        fakeData: 'Test data',
        chooseFile: 'Choose file',
        enterIpToConnect: 'Please enter IP to connect'
      },
      chooseParamsButtons: {
        chooseSource: 'Choose params source',
        template: 'Template',
        manual: 'Manual',
        chooseParamsToShow: 'Choose params to show',
        containerParams: 'Show list',
        chooseParamsToShowInContainer: 'Choose params to show',
        apply: 'Apply'
      },
      physics: {
        header: 'Physical parameter values',
        chooseParams: 'Please, choose params to show'
      },
      binary: {
        header: 'Active binary params'
      },
      events: {
        header: 'Stream data analysis'
      },
      ungrouped: 'Ungrouped'
    },
    chart: {
      threeDim: {
        model: {
          follow: 'Follow',
          freeCamera: 'Free camera',
        }
      }
    },
    topMenu: {
      brand: 'Luche',
      supervision: 'Supervision',
      fileImport: 'Import',
      upload: 'Upload',
      flightImporterDropdown: {
        fileImport: 'Import',
        chooseFile: 'Choose file',
      },
      flightUploaderDropdown: {
        flightUploading: 'Flight uploading',
        chooseFile: 'Choose file',
        preview: 'Preview',
        on: 'On',
        off: 'Off',
      }
    },
    fdrSelector: {
      placeholder: 'Select FDR type'
    },
    fdrTemplateSelector: {
      placeholder: 'Select template',
      item: {
        default: 'Default',
        last: 'Last',
        events: 'Events',
      }
    },
    cycloParams: {
      colorPicker: {
        cancel: 'Cancel',
        save: 'Save'
      }
    },
    mainMenu: {
      flights: 'Flights',
      fdrs: 'FDRs',
      calibration: 'Calibration',
      users: 'Users',
      results: 'Results',
      search: 'Search',
    },
    flightViewOptionsSwitch: {
      events: 'Events',
      params: 'Parameters',
      templates: 'Templates'
    },
    flightListViewSwitch : {
      treeView: 'Madera',
      tableView: 'Mesa',
    },
    flightTemplateEdit: {
      toolbar: {
        templates: 'Templates'
      },
      saveForm: {
        templateName: 'Template Name'
      }
    },
    table: {
      previous: 'Previous',
      next: 'Next',
      loading: 'Loading...',
      noRowsFound: 'No rows found',
      page: 'Page',
      of: 'of',
      rows: 'rows',
    }
  }
}

export default translationsEs;
