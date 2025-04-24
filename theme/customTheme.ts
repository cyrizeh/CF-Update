import { CustomFlowbiteTheme } from 'flowbite-react/lib/esm/components/Flowbite/FlowbiteTheme';

export const customTheme: CustomFlowbiteTheme = {
  textInput: {
    base: 'relative w-full',
    field: {
      icon: {
        base: 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
        svg: 'h-5 w-5 text-gray-500 dark:text-gray-400',
      },
      base: 'w-full',
      input: {
        base: 'w-full text font-normal disabled:opacity-30',
        colors: {
          gray: 'bg-green-500 border dark:bg-[#292B2C] dark:border-neutral-600 dark:focus:border-cyan-500 ring-0 focus:ring-0 placeholder-gray-300',
          right:
            '!text-right bg-green-500 border dark:bg-[#292B2C] dark:border-neutral-600 dark:focus:border-cyan-500 ring-0 focus:ring-0',
          'right-failure':
            '!text-right text-rose-400 bg-green-500 border dark:bg-[#292B2C] dark:border-rose-400 dark:focus:border-rose-400 ring-0 focus:ring-0',
          failure:
            'bg-green-500 border text-rose-400 dark:text-rose-400 dark:bg-[#292B2C] dark:border-rose-400 dark:focus:border-rose-400 ring-0 focus:ring-0 dark:placeholder:text-rose-400',
          grayDefault:
            'bg-dark-grey-400 border-dark-grey-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-dark-grey-300 dark:bg-dark-grey-400 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 rounded-lg p-2.5 text-sm',
        },
        withIcon: {
          on: '!pl-10',
        },
      },
    },
  },
  radio: {
    root: {
      base: 'h-4 w-4 border-gray-500 focus:ring-0 dark:focus:ring-0 focus:shadow-none  dark:focus:shadow-none dark:border-gray-400 dark:bg-gray-700 dark:focus:border-0 dark:focus:bg-[#17b5d7] text-[#17b5d7] ',
    },
  },
  button: {
    base: 'group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 whitespace-nowrap',
    color: {
      primary:
        'text-white bg-gray-800 border border-transparent hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 disabled:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:border-gray-700 dark:disabled:hover:bg-gray-800',
      primaryDark:
        'text-white bg-gray-900 focus:ring-4 focus:ring-gray-300 disabled:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:border-gray-700 dark:disabled:hover:bg-gray-800',
      grayBorderedDefault:
        'text-white bg-transparent dark:bg-transparent border rounded-md border-dark-grey-300 dark:border-dark-grey-300',
      secondary:
        'text-gray-200 bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 disabled:hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:border-gray-700 dark:disabled:hover:bg-gray-800',
      outlineOne:
        'rounded--lg border border-neutral-600 justify-center items-center gap-2 inline-flex hover:border-white text-white transition',
    },
    gradientDuoTone: {
      primary:
        'text-white bg-gradient-to-r from-cryo-blue to-cryo-cyan hover:bg-gradient-to-l focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800',
      primaryBorder:
        'text-white bg-gradient-to-r from-cryo-blue to-cryo-cyan hover:bg-gradient-to-l focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800',
      inactiveTab: 'text-gray-400 dark:text-gray-400 bg-[#292b2c] dark:bg-[#292b2c] ',
    },
    outline: {
      on: 'flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-inherit bg-[#161C1E] !dark:bg-[#161C1E] dark:text-white w-full',
    },

    disabled: 'cursor-not-allowed opacity-50',
  },
  progress: {
    "base": "w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
    "label": "mb-1 flex justify-between font-medium dark:text-white",
    "bar": "space-x-2 rounded-full text-center font-medium leading-none text-cyan-300 dark:text-cyan-100",
    "color": {
      "dark": "bg-gray-600 dark:bg-gray-300",
      "blue": "bg-blue-600",
      "red": "bg-red-600 dark:bg-red-500",
      "green": "bg-green-600 dark:bg-green-500",
      "yellow": "bg-yellow-400",
      "indigo": "bg-indigo-600 dark:bg-indigo-500",
      "purple": "bg-purple-600 dark:bg-purple-500",
      "cyan": "bg-cyan-600",
      "gray": "bg-gray-500",
      "lime": "bg-lime-600",
      "pink": "bg-pink-500",
      "teal": "bg-teal-600",
      "cryo": "bg-gradient-to-r from-cryo-blue to-cryo-cyan",
    },
    "size": {
      "sm": "h-1.5",
      "md": "h-2.5",
      "lg": "h-4",
      "xl": "h-6"
    }
  },
  spinner: {
    base: 'inline animate-spin text-gray-200',
    color: {
      failure: 'fill-red-600',
      gray: 'fill-gray-600',
      info: 'fill-cyan-600',
      pink: 'fill-pink-600',
      purple: 'fill-purple-600',
      success: 'fill-green-500',
      warning: 'fill-yellow-400',
    },
    light: {
      off: {
        base: 'dark:text-white',
        color: {
          failure: '',
          gray: 'dark:fill-gray-300',
          info: '',
          pink: '',
          purple: '',
          success: '',
          warning: '',
        },
      },
      on: {
        base: '',
        color: {
          failure: '',
          gray: '',
          info: '',
          pink: '',
          purple: '',
          success: '',
          warning: '',
        },
      },
    },
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-10 h-10',
    },
  },
  navbar: {
    root: {
      base: 'bg-white px-2 py-2.5 sm:px-4 border-b dark:border-gray-700 dark:bg-cryo-dark-grey',
      inner: {
        base: 'mx-auto flex flex-wrap items-center justify-between',
        fluid: {
          on: '',
          off: 'container',
        },
      },
    },
  },
  badge: {
    root: {
      base: 'flex h-fit items-center gap-1 font-semibold',
      color: {
        cryo: 'bg-gradient-to-r from-cryo-blue to-cryo-cyan text-white',
        info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-300',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600',
        failure:
          'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900 group-hover:bg-red-200 dark:group-hover:bg-red-300',
        success:
          'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-300',
        warning:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-300',
        indigo:
          'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-300',
        purple:
          'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900 group-hover:bg-purple-200 dark:group-hover:bg-purple-300',
        pink: 'bg-pink-100 text-pink-800 dark:bg-pink-200 dark:text-pink-900 group-hover:bg-pink-200 dark:group-hover:bg-pink-300',
        blue: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-200 dark:text-cyan-900 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-300',
        cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-200 dark:text-cyan-900 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-300',
        dark: 'bg-gray-600 text-gray-100 dark:bg-gray-900 dark:text-gray-200 group-hover:bg-gray-500 dark:group-hover:bg-gray-700',
        light:
          'bg-gray-200 text-gray-800 dark:bg-gray-400 dark:text-gray-900 group-hover:bg-gray-300 dark:group-hover:bg-gray-500',
        green:
          'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-300',
        lime: 'bg-lime-100 text-lime-800 dark:bg-lime-200 dark:text-lime-900 group-hover:bg-lime-200 dark:group-hover:bg-lime-300',
        red: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900 group-hover:bg-red-200 dark:group-hover:bg-red-300',
        teal: 'bg-teal-100 text-teal-800 dark:bg-teal-200 dark:text-teal-900 group-hover:bg-teal-200 dark:group-hover:bg-teal-300',
        yellow:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-300',
      },
      href: 'group',
      size: {
        xs: 'p-1 text-xs',
        sm: 'p-1.5 text-sm',
      },
    },
    icon: {
      off: 'rounded px-2 py-0.5',
      on: 'rounded-full p-1.5',
      size: {
        xs: 'w-3 h-3',
        sm: 'w-3.5 h-3.5',
      },
    },
  },
  card: {
    root: {
      base: 'flex rounded-lg border-2 dark:border-gray-500 shadow-md dark:border-gray-700 dark:bg-neutral-900 gap-1 p-1',
    },
  },
  sidebar: {
    root: {
      inner: 'h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 py-4 px-3 dark:bg-cryo-dark-grey',
    },
    item: {
      base: 'flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
      active: '',
    },
  },
  select: {
    base: 'flex',
    field: {
      select: {
        base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 font-normal',
        colors: {
          gray: 'dark:border-cryo-light-grey dark:bg-cryo-dark-grey dark:focus:border-cyan-500 dark:focus:ring-0',
          failure:
            'dark:ring-blue-500 text-rose-400 dark:text-rose-400 dark:placeholder:text-rose-400 dark:border-rose-400 dark:bg-cryo-dark-grey dark:focus:border-rose-400 dark:focus:ring-0',
        },
      },
    },
  },
  modal: {
    root: {
      base: 'fixed top-0 right-0 left-0 z-50 h-modal overflow-y-auto overflow-x-hidden md:inset-0 md:h-full dark:text-white',
      show: {
        on: 'flex bg-slate-950 bg-opacity-40 backdrop-blur-sm',
        off: 'hidden',
      },
      sizes: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
      },
      positions: {
        'top-left': 'items-start justify-start',
        'top-center': 'items-start justify-center',
        'top-right': 'items-start justify-end',
        'center-left': 'items-center justify-start',
        center: 'items-center justify-center',
        'center-right': 'items-center justify-end',
        'bottom-right': 'items-end justify-end',
        'bottom-center': 'items-end justify-center',
        'bottom-left': 'items-end justify-start',
      },
    },
    content: {
      base: 'relative md:h-full w-full rounded-lg border-0 p-0.5 md:h-auto bg-gradient-to-r from-cryo-blue to-cryo-cyan',
      inner: 'relative rounded-lg bg-white shadow dark:bg-neutral-800 flex flex-col ',
    },
    body: {
      base: 'p-6 flex-1 text-white max-h-[676px] overflow-auto',
      popup: 'pt-0',
    },
    header: {
      base: 'flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5 dark:text-white',
      popup: 'p-2 border-b-0',
      title: 'text-xl font-medium dark:text-white',
      close: {
        base: 'ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
        icon: 'h-5 w-5',
      },
    },
    footer: {
      base: 'flex items-center space-x-2 rounded-b border-gray-200 p-6 pt-0 border-t-0 dark:text-white',
      popup: 'border-t-0',
    },
  },
  table: {
    head: {
      cell: {
        base: 'group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-dark-grey-100 dark:bg-dark-grey-100 px-6 py-3 text-white font-normal text-sm',
      },
    },
    row: {
      base: 'text-white font-normal border-y border-y-dark-grey-200 dark:border-y dark:border-y-dark-grey-200 dark:bg-dark-grey-200 hover:bg-dark-grey-100 dark:hover:bg-dark-grey-100 text-sm',

      baseReverse:
        'text-black font-normal border-y border-y-dark-grey-200 dark:border-y hover:border-y-dark-grey-200 hover:bg-dark-grey-200 bg-dark-grey-100 hover:bg-dark-grey-100 text-sm',
    },
    body: {
      cell: {
        base: 'group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-7',
      },
    },
  },
  accordion: {
    root: {
      base: 'flex flex-col border-2 text-white',
    },
    title: {
      base: 'flex border-0 justify-between py-1.5 text-lg font-normal gap-3 w-full',
      open: {
        off: 'border-b-2 border-[#4F4F4F]',
        on: 'mb-6',
      },
      arrow: {
        base: 'h-6 w-6 shrink-0',
        open: {
          off: 'rotate-90',
          on: 'rotate-0',
        },
      },
    },
    content: {
      base: '',
    },
  },
  toast: {
    root: {
      base: 'flex w-full rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-[#292B2C] dark:border-yellow-100 border',
      closed: 'opacity-0 ease-out',
      removed: 'hidden',
    },
  },
  dropdown: {
    arrowIcon: 'ml-2 h-4 w-4',
    content: 'focus:outline-none ',
    floating: {
      animation: 'transition-opacity',
      arrow: {
        base: 'absolute z-10 h-2 w-2 rotate-45',
        style: {
          dark: 'bg-gray-900 dark:bg-gray-700',
          light: 'bg-white',
          auto: 'bg-white dark:bg-gray-700',
        },
        placement: '-4px',
      },
      base: 'z-10 w-full max-w-[195px] rounded-lg divide-y divide-gray-100 shadow focus:outline-none overflow-hidden',
      content: 'py-1 text-sm text-gray-700 dark:text-gray-200',
      divider: 'my-1 h-px bg-gray-100 dark:bg-gray-600',
      header: 'block py-2 px-4 text-sm text-gray-700 dark:text-gray-200',
      hidden: 'invisible opacity-0',
      item: {
        container: '',
        base: 'flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white',
        icon: 'mr-2 h-4 w-4',
      },
      style: {
        dark: 'bg-[#1E2021] text-white dark:bg-[#1E2021]',
        light: 'bg-[#1E2021] text-white dark:bg-[#1E2021]',
        auto: 'bg-[#1E2021] text-white dark:bg-[#1E2021]',
      },
      target: 'w-fit',
    },
    inlineWrapper: 'flex items-center',
  },
  pagination: {
    base: '',
    layout: {
      table: {
        base: 'text-sm text-gray-700 dark:text-gray-400',
        span: 'font-semibold text-gray-900 dark:text-white',
      },
    },
    pages: {
      base: 'xs:mt-0 inline-flex items-center -space-x-px',
      showIcon: 'inline-flex',
      previous: {
        base: 'text-sm ml-0 rounded-l-lg  bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:bg-transparent dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        icon: 'h-5 w-5',
      },
      next: {
        base: 'text-sm rounded-r-lg  bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:bg-transparent dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        icon: 'h-5 w-5',
      },
      selector: {
        base: 'rounded-md w-10 mr-1 text-sm bg-white py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:bg-transparent dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        active:
          'bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:bg-gray-700 dark:text-white bg-gradient-to-r from-cryo-blue to-cryo-cyan',
        disabled: 'opacity-50 cursor-normal',
      },
    },
  },
  tooltip: {
    target: 'w-fit',
    animation: 'transition-opacity',
    arrow: {
      base: 'absolute z-10 h-2 w-2 rotate-45',
      style: {
        dark: 'bg-neutral-700 dark:bg-neutral-700 ',
        light: 'bg-white',
        auto: 'bg-white dark:bg-gray-700',
      },
      placement: '-4px',
    },
    base: 'absolute inline-block z-10 rounded-lg py-2 px-3 shadow-sm',
    hidden: 'invisible opacity-0',
    style: {
      dark: 'bg-neutral-700 text-white dark:bg-neutral-700',
      light: 'border border-gray-200 bg-white text-gray-900',
      auto: 'border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white',
    },
    content: 'relative z-20 text-[11px]',
  },
} as CustomFlowbiteTheme;
