React = require 'react'
TrainingStore = require '../stores/training_store'
ServerActions = require '../../actions/server_actions'

getState = ->
  training_module: TrainingStore.getTrainingModule()

TrainingModuleHandler = React.createClass(
  displayName: 'TraniningModuleHandler'
  mixins: [TrainingStore.mixin]
  getInitialState: ->
    getState()
  storeDidChange: ->
    @setState getState()
  componentWillMount: ->
    module_id = document.getElementById('react_root').dataset.moduleId
    ServerActions.fetchTrainingModule(module_id: module_id)
  render: ->
    slides = _.compact(@state.training_module.slides).map (slide) =>
      link = "#{@state.training_module.slug}/#{slide.slug}"
      <li>
        <a href={link}>
          <h3>{slide.title}</h3>
          <p>{slide.summary}</p>
        </a>
      </li>

    <div className='training__toc-container'>
      <h1><small className="heading appearance-hr">Table of Contents</small></h1>
      <ol>
      {slides}
      </ol>
    </div>
)

module.exports = TrainingModuleHandler
