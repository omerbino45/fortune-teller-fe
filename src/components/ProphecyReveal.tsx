import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
}

export default function ProphecyReveal({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
    >
      {children}
    </motion.div>
  )
}
