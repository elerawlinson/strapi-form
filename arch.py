import graphviz

dot = graphviz.Digraph(format='png')
dot.attr(rankdir='TB', size='20', fontsize='10', fontname='Arial')
dot.node_attr.update(style='filled', fontname='Arial', fontsize='10', margin='0.1,0.1')

colors = {
    'SurveyPage': 'lightblue',
    'Survey': 'lightgreen',
    'Question': 'lightsalmon'
}

# SurveyPage cluster (lighter border, smaller label)
with dot.subgraph(name='cluster_surveypage') as sp:
    sp.attr(style='rounded', color='lightblue', label='SurveyPage.tsx', fontsize='11', fontname='Arial')
    sp.node_attr.update(fillcolor=colors['SurveyPage'])
    sp.node('Start', 'Start (App loads)')
    sp.node('SurveyPage', 'SurveyPage.tsx\nphase="welcome"')
    sp.node('Welcome', 'Welcome screen\nClick "Start Survey"')
    sp.node('InProgress', 'phase="inProgress"\nRender <Survey />')

# Survey cluster
with dot.subgraph(name='cluster_survey') as s:
    s.attr(style='rounded', color='lightgreen', label='Survey.tsx', fontsize='11', fontname='Arial')
    s.node_attr.update(fillcolor=colors['Survey'])
    s.node('Survey', 'Survey.tsx\nuseEffect → getSurvey')
    s.node('SetState', 'Set state: survey, currentQuestion, numQuestions')
    s.node('HandleAnswer', 'Survey.handleAnswer\nUpdates questionHistory, answers')
    s.node('LogicBranch', 'Evaluate branchLogic\nnextQuestionKey?')
    s.node('NextQ', 'Set currentQuestion or call onSurveyEnd')

# Question cluster
with dot.subgraph(name='cluster_question') as q:
    q.attr(style='rounded', color='lightsalmon', label='Question.tsx', fontsize='11', fontname='Arial')
    q.node_attr.update(fillcolor=colors['Question'])
    q.node('Question', 'Render <Question />\nProps: question, onAnswer')
    q.node('UserInput', 'User input → clicks Next')

# Completed node outside clusters
dot.node('Completed', 'phase="completed"\nThank You screen', fillcolor='lightgrey')

# Edges
dot.edge('Start', 'SurveyPage')
dot.edge('SurveyPage', 'Welcome')
dot.edge('Welcome', 'InProgress')
dot.edge('InProgress', 'Survey')
dot.edge('Survey', 'SetState')
dot.edge('SetState', 'Question')
dot.edge('Question', 'UserInput')
dot.edge('UserInput', 'HandleAnswer')
dot.edge('HandleAnswer', 'LogicBranch')
dot.edge('LogicBranch', 'NextQ')
dot.edge('NextQ', 'Question', label='Next Question')
dot.edge('LogicBranch', 'Completed', label='End of Survey')

# Render and open
dot.render('survey_logic_flow_compact', cleanup=True)
dot.view()
