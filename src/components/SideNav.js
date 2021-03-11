import { Sidebar } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

const style = {
    display: 'flex',
    flex: '0 0 320px',
}

/**
 * Renders the sidebar containing the available sections.
 * If its on a path/route that doesn't match any section it will render null.
 * This is because when a form or the CardLinks are displayed, the sidebar should not show.
 */
class SideNav extends Component {
    changeSectionHandler = key => {
        const { sections, history } = this.props
        const section = sections.find(section => section.key === key)

        history.push(section.path)
    }

    render() {
        const {
            sections,
            location: { pathname },
        } = this.props
        const sectionForPath = sections.find(
            section => section.path === pathname
        )
        const onLandingPage = pathname === '/'
        const sectionKey = sectionForPath ? sectionForPath.key : null

        if (!sectionForPath && !onLandingPage) {
            return null
        }

        return (
            <div style={style}>
                <Sidebar
                    sections={sections}
                    onChangeSection={this.changeSectionHandler}
                    currentSection={sectionKey}
                />
            </div>
        )
    }
}

SideNav.propTypes = {
    history: PropTypes.object.isRequired,
    sections: PropTypes.array.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}

export default withRouter(SideNav)
