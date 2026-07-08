import React, { forwardRef } from 'react'
import SkillIndicator from './SkillIndicator'

/**
 * SkillCard — A single skill category card.
 * Each skill now has a name, level, and optional label.
 * Uses forwardRef so GSAP ScrollTrigger can target the card.
 */
const SkillCard = forwardRef(({ icon, title, skills, ringRefs, ringStartIndex }, ref) => (
  <div className="skill-card" ref={ref}>
    {/* Glow border accent on hover */}
    <div className="skill-card__glow" />

    <div className="skill-card__header">
      <span className="skill-card__icon">{icon}</span>
      <h3 className="skill-card__title">{title}</h3>
    </div>

    <ul className="skill-card__list">
      {skills.map((skill, i) => (
        <li key={i} className="skill-card__item">
          <div className="skill-card__item-info">
            <span className="skill-card__bullet" />
            <span className="skill-card__name">{skill.name}</span>
            {skill.label && (
              <span className="skill-card__tag">{skill.label}</span>
            )}
          </div>
          <SkillIndicator
            ref={(el) => {
              if (ringRefs && ringStartIndex !== undefined) {
                ringRefs.current[ringStartIndex + i] = el
              }
            }}
            level={skill.level}
            size={28}
            label={
              skill.level >= 85 ? 'Advanced'
                : skill.level >= 60 ? 'Intermediate'
                : 'Beginner'
            }
          />
        </li>
      ))}
    </ul>
  </div>
))

SkillCard.displayName = 'SkillCard'

export default SkillCard
