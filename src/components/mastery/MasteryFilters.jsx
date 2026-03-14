export default function MasteryFilters({ filters, viewMode, topics, onChangeFilters, onChangeViewMode, t }) {
  return (
    <section className="mastery-filters" aria-label={t('mastery.filters.ariaLabel')}>
      <div className="mastery-filters__group mastery-filters__group--view-toggle">
        <button
          className={`mastery-chip-button${viewMode === 'map' ? ' is-active' : ''}`}
          onClick={() => onChangeViewMode('map')}
        >
          {t('mastery.views.map')}
        </button>
        <button
          className={`mastery-chip-button${viewMode === 'list' ? ' is-active' : ''}`}
          onClick={() => onChangeViewMode('list')}
        >
          {t('mastery.views.list')}
        </button>
      </div>

      <label className="mastery-filters__field">
        <span>{t('mastery.filters.gradeBand')}</span>
        <select value={filters.gradeBand} onChange={event => onChangeFilters({ gradeBand: event.target.value })}>
          <option value="all">{t('mastery.filters.allGradeBands')}</option>
          <option value="grade6">{t('onboarding.paths.grade6.title')}</option>
          <option value="grade7">{t('onboarding.paths.grade7.title')}</option>
          <option value="prealgebra">{t('onboarding.paths.prealgebra.title')}</option>
        </select>
      </label>

      <label className="mastery-filters__field">
        <span>{t('mastery.filters.topic')}</span>
        <select value={filters.topicId} onChange={event => onChangeFilters({ topicId: event.target.value })}>
          <option value="all">{t('mastery.filters.allTopics')}</option>
          {topics.map(topic => (
            <option key={topic.id} value={topic.id}>{topic.name}</option>
          ))}
        </select>
      </label>

      <label className="mastery-filters__field">
        <span>{t('mastery.filters.state')}</span>
        <select value={filters.state} onChange={event => onChangeFilters({ state: event.target.value })}>
          <option value="all">{t('mastery.filters.allStates')}</option>
          <option value="not_started">{t('mastery.states.not_started')}</option>
          <option value="practicing">{t('mastery.states.practicing')}</option>
          <option value="almost_mastered">{t('mastery.states.almost_mastered')}</option>
          <option value="mastered">{t('mastery.states.mastered')}</option>
          <option value="needs_review">{t('mastery.states.needs_review')}</option>
        </select>
      </label>

      <label className="mastery-filters__field">
        <span>{t('mastery.filters.sort')}</span>
        <select value={filters.sort} onChange={event => onChangeFilters({ sort: event.target.value })}>
          <option value="recommended">{t('mastery.sort.recommended')}</option>
          <option value="weakest">{t('mastery.sort.weakest')}</option>
          <option value="recent">{t('mastery.sort.recent')}</option>
          <option value="near_mastery">{t('mastery.sort.nearMastery')}</option>
        </select>
      </label>
    </section>
  )
}