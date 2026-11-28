import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import FormField from './FormField'

// Password input with a button to show or hide the text
export default function PasswordField(props) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <FormField
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={t(visible ? 'login.hidePassword' : 'login.showPassword')}
          aria-pressed={visible}
          className="grid size-7 shrink-0 place-items-center rounded-md text-muted hover:bg-hover hover:text-ink focus-visible:ring-3 focus-visible:ring-focus focus-visible:outline-none"
        >
          <Icon size={18} />
        </button>
      }
    />
  )
}
