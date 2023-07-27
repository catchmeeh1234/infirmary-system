export const menus = [
    {
        'name': 'Dashboard',
        'icon': 'home',
        'link': `dashboard?id=${localStorage.getItem('userid')}`,
        'open': false,
        // 'chip': { 'value': 1, 'color': 'accent' },
    },
    {
      'name': 'Purchase Requests',
      'icon': 'assignment',
      'link': false,
      'open': false,
      'sub': [
        {
          'name': 'View PR',
          'link': 'pages/viewPR',
          'icon': 'remove_red_eye',
          'chip': false,
          'open': false,
        },
        {
          'name': 'Create PR',
          'link': 'pages/addPR',
          'icon': 'insert_drive_file',
          'chip': false,
          'open': false,
        },
        {
          'name': 'Approve PR',
          'link': 'pages/approvePr',
          'icon': 'thumbs_up_down',
          'chip': false,
          'open': false,
        },
        {
          'name': 'Sample',
          'link': 'pages/sampleComponent',
          'icon': 'thumbs_up_down',
          'chip': false,
          'open': false,
        },
      ]
      // 'chip': { 'value': 1, 'color': 'accent' },
   },
  //  {
  //     'name': 'Accounts',
  //     'icon': 'home',
  //     'link': 'pages/viewAccounts',
  //     'open': false,
  //  },
    // {
    //     'name': 'Documents',
    //     'icon': 'folder',
    //     'link': false,
    //     'open': false,
    //     'sub': [
    //       {
    //         'name': 'View Documents',
    //         'link': 'pages/viewDocuments',
    //         'icon': 'remove_red_eye',
    //         'chip': false,
    //         'open': false,
    //       },
    //       {
    //         'name': 'Upload Document',
    //         'link': 'material-widgets/buttons',
    //         'icon': 'file_upload',
    //         'chip': false,
    //         'open': false,
    //       },
    //       {
    //         'name': 'Upload Application',
    //         'link': 'material-widgets/buttons',
    //         'icon': 'drive_folder_upload',
    //         'chip': false,
    //         'open': false,
    //       }
    //     ]
        // 'sub': [
        //     {
        //         'name': 'Buttons',
        //         'link': 'material-widgets/buttons',
        //         'icon': 'indeterminate_check_box',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'List',
        //         'link': 'material-widgets/list',
        //         'icon': 'list',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {

        //         'name': 'Stepper',
        //         'link': 'material-widgets/stepper',
        //         'icon': 'view_week',
        //         'chip': false,
        //         'open': false,

        //     },
        //     {
        //         'name': 'Expansion',
        //         'link': 'material-widgets/expansion',
        //         'icon': 'web_aaset',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Progress Spinner',
        //         'link': 'material-widgets/spinner',
        //         'icon': 'cached',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Cards',
        //         'link': 'material-widgets/cards',
        //         'icon': 'crop_16_9',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Icons',
        //         'link': 'material-widgets/icons',
        //         'icon': 'gif',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {

        //         'name': 'AutoComplete',
        //         'link': 'material-widgets/autocomplete',
        //         'icon': 'get_app',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'CheckBox',
        //         'link': 'material-widgets/checkbox',
        //         'icon': 'check_box',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'DatePicker',
        //         'link': 'material-widgets/datepicker',
        //         'icon': 'date_range',
        //         'chip': false,
        //         'open': false,
        //     },

        //     {
        //         'name': 'Slider',
        //         'link': 'material-widgets/slider',
        //         'icon': 'keyboard_tab',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Slide Toggle',
        //         'link': 'material-widgets/slide-toggle',
        //         'icon': 'album',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Menu',
        //         'icon': 'menu',
        //         'link': 'material-widgets/menu',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Progress Bar',
        //         'link': 'material-widgets/progress-bar',
        //         'icon': 'trending_flat',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Input',
        //         'icon': 'input',
        //         'link': 'material-widgets/input',
        //         'open': false,
        //     },
        //     {
        //         'name': 'Radio',
        //         'icon': 'radio_button_checked',
        //         'link': 'material-widgets/radio',
        //         'chip': false,
        //         'open': false,
        //     },
        //     {
        //         'name': 'Select',
        //         'icon': 'select_all',
        //         'link': 'material-widgets/select',
        //         'open': false,
        //     },
        // ]
    //},
    // {
    //     'name'   : 'Forms',
    //     'icon'   : 'mode_edit',
    //     'open'   : false,
    //     'link'   : false,
    //     'sub'    :  [
    //                     {
    //                         'name': 'Template Driven',
    //                         'icon': 'mode_edit',
    //                         'open'   : false,
    //                         'link':'forms/template_forms'
    //                     },
    //                     {
    //                         'name': 'Reactive Forms',
    //                         'icon': 'text_fields',
    //                         'open'   : false,
    //                         'link':'forms/reactive_forms'
    //                     }
    //                 ]
    // },
    //{
    //    'name': 'Categories',
    //    'icon': 'dashboard',
    //    'link': false,
    //    'open': false,
    //    'sub': [
    //        {
    //          'name': 'View Categories',
    //          'icon': '',
    //          'link': 'tables/featured',
    //          'open': false,
    //        },
    //        {
    //            'name': 'Fixed',
    //            'icon': 'filter_list',
    //            'link': 'tables/fixed',
    //            'open': false,
    //        },

    //        {
    //            'name': 'Add Categories',
    //            'icon': '',
    //            'link': 'tables/responsive',
    //            'open': false,
    //        }
    //    ]

    //},
    //{
    //    'name': 'Suppliers',
    //    'icon': 'people',
    //    'link': '/auth/guarded-routes',
    //    'open': false,
    //    'sub': [
    //      {
    //        'name': 'View Suppliers',
    //        'icon': '',
    //        'link': 'tables/responsive',
    //        'open': false,
    //      },
    //      {
    //        'name': 'Add Supplier',
    //        'icon': '',
    //        'link': 'tables/responsive',
    //        'open': false,
    //      }
    //    ]
    //}, {
    //    'name': 'Scrumboard',
    //    'open': false,
    //    'link': '/auth/scrumboard',
    //    'icon': 'grade',
    //}, {
    //    'name': 'Applications',
    //    'icon': 'view_module',
    //    'open': false,
    //    'link': false,
    //    'sub': [
    //        {
    //            'name': 'chat',
    //            'icon': 'chat',
    //            'link': 'chats/chat',
    //            'open': false,
    //        },
    //        {
    //            'name': 'mail',
    //            'icon': 'mail',
    //            'link': 'mail/mail',
    //            'open': false,
    //        },
    //        {
    //            'name': 'Editor',
    //            'icon': 'editor',
    //            'link': 'editor/editor',
    //            'open': false,
    //        }
    //    ]
    //}
    //, {
    //    'name': 'Pages',
    //    'icon': 'content_copy',
    //    'open': false,
    //    'link': false,
    //    'sub': [
    //        {
    //            'name': 'Login',
    //            'icon': 'work',
    //            'open': false,
    //            'link': '../login',
    //        }, {
    //            'name': 'Services',
    //            'icon': 'local_laundry_service',
    //            'open': false,
    //            'link': 'pages/services',
    //        }, {
    //            'name': 'Contact',
    //            'icon': 'directions',
    //            'open': false,
    //            'link': 'pages/contact'
    //        }
    //    ]
    //}
    //, {

    //    'name': 'Charts',
    //    'icon': 'pie_chart_outlined',
    //    'open': false,
    //    'link': false,
    //    'sub': [
    //        {
    //            'name': 'chartjs',
    //            'icon': 'view_list',
    //            'link': 'charts/chartjs',
    //            'open': false,

    //        },
    //        {
    //            'name': 'ngx-chart',
    //            'icon': 'show_chart',
    //            'open': false,
    //            'link': 'charts/ngx-charts',
    //        },
            // {
            //     'name': 'nvd3',
            //     'icon': 'pie_chart',
            //     'open': false,
            //     'link': 'charts/nvd3-charts',
            // }
    //    ]
    //},
    // {
    //     'name': 'maps',
    //     'icon': 'map',
    //     'open': false,
    //     'link': false,
    //     'sub': [
    //         {
    //             'name': 'google-map',
    //             'icon': 'directions',
    //             'link': 'maps/googlemap',
    //             'open': false,
    //         },
    //         {
    //             'name': 'leaflet-map',
    //             'icon': 'directions',
    //             'link': 'maps/leafletmap',
    //             'open': false,
    //         }
    //     ]
    //}
];
