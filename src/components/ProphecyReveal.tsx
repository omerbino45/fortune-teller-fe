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
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      {/* Shimmer gleam — sweeps once after reveal completes */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 0.75, ease: 'easeInOut', delay: 0.7 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}
