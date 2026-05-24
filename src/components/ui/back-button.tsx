import { ArrowBigLeftIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export function BackButton({ to }: { to: string }) {
  return (
    <div className="sticky z-10 hidden h-0 overflow-visible md:block" style={{ top: 'calc(20rem)' }}>
      <Link
        className="group absolute top-0 -left-14 flex items-center gap-2 rounded-full bg-primary/80 px-4 py-2 whitespace-nowrap text-white no-underline shadow-lg hover:-translate-x-16 hover:bg-primary hover:shadow-[4px_8px_24px_rgba(0,0,0,0.35)]"
        style={{
          transition: 'translate 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
        }}
        to={to}
      >
        <ArrowBigLeftIcon className="size-7" />
        <span className="pr-12 font-semibold opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.2s ease 0.15s' }}>
          Retour
        </span>
      </Link>
    </div>
  )
}
