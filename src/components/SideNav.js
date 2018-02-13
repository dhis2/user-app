import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

const style = {
    display: 'flex',
    flex: '0 0 320px',
};

class SideNav extends Component {
    static propTypes = {
        sections: PropTypes.array.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }),
    };

    componentWillMount() {
        const { sections, history, location: { pathname } } = this.props;
        const userPath = sections[0].path;

        if (pathname === '/') {
            history.push(userPath);
        }
    }

    changeSectionHandler(key) {
        const { sections, history } = this.props;
        const section = sections.find(section => section.key === key);

        history.push(section.path);
    }

    getSectionKeyForCurrentPath() {
        const { sections, location: { pathname } } = this.props;
        const currentSection = sections.find(section => section.path === pathname);
        return currentSection ? currentSection.key : null;
    }

    render() {
        const { sections } = this.props;
        const currentSectionKey = this.getSectionKeyForCurrentPath();
        const boundChangeHandler = this.changeSectionHandler.bind(this);

        if (!currentSectionKey) {
            return null;
        }

        return (
            <div style={style}>
                <Sidebar
                    sections={sections}
                    onChangeSection={boundChangeHandler}
                    currentSection={currentSectionKey}
                />
            </div>
        );
    }
}

export default withRouter(SideNav);
