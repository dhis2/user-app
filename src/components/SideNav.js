import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

class SideNav extends Component {
    static propTypes = {
        sections: PropTypes.array.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentWillMount() {
        const { sections, history, location: { pathname } } = this.props;
        if (pathname === '/') {
            history.push(sections[0].path);
        }
    }

    changeSectionHandler(key) {
        const { sections, history } = this.props;
        const section = sections.find(section => section.key === key);
        history.push(section.path);
    }

    getSectionKeyForCurrentPath() {
        const { sections, location: { pathname } } = this.props;
        const currentSection = sections.find(
            section => section.path === pathname
        );
        return currentSection ? currentSection.key : null;
    }

    render() {
        const { sections } = this.props;
        return (
            <Sidebar
                sections={sections}
                onChangeSection={this.changeSectionHandler.bind(this)}
                currentSection={this.getSectionKeyForCurrentPath()}
            />
        );
    }
}
export default withRouter(SideNav);
