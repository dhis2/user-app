import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

const style = {
    display: 'flex',
    flex: '0 0 320px',
};

/**
 * Renders the sidebar containing the available sections.
 * If its on a path/route that doesn't match any section it will render null.
 * This is because when a form or the CardLinks are displayed, the sidebar should not show.
 */
class SideNav extends Component {
    changeSectionHandler = key => {
        const { sections, history } = this.props;
        const section = sections.find(section => section.key === key);

        history.push(section.path);
    };

    getSectionKeyForCurrentPath() {
        const { sections, location: { pathname } } = this.props;
        const currentSection = sections.find(section => section.path === pathname);
        return currentSection ? currentSection.key : null;
    }

    render() {
        const { sections } = this.props;
        const currentSectionKey = this.getSectionKeyForCurrentPath();

        if (!currentSectionKey) {
            return null;
        }

        return (
            <div style={style}>
                <Sidebar
                    sections={sections}
                    onChangeSection={this.changeSectionHandler}
                    currentSection={currentSectionKey}
                />
            </div>
        );
    }
}

SideNav.propTypes = {
    sections: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
};

export default withRouter(SideNav);
