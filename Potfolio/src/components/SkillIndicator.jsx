import React, { forwardRef, useState, useEffect } from 'react'

/**
 * SkillIndicator — Horizontal progress bar.
 *
 * Props:
 *   level    — 0–100 percentage
 *   label    — e.g. "Advanced", "Learning" (shown beside the bar)
 */
const SkillIndicator = forwardRef(({ level = 0, label }, ref) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), 400)
    return () => clearTimeout(timer)
  }, [level])

  return (
    <div className="skill-bar" ref={ref} data-level={level}>
      <div className="skill-bar__track">
        <div
          className="skill-bar__fill"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="skill-bar__pct">{level}%</span>
      {label && <span className="skill-bar__label">{label}</span>}
    </div>
  )
})

SkillIndicator.displayName = 'SkillIndicator'

export default SkillIndicator
