import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import IconButton from 'material-ui/IconButton/IconButton';
import { grey600 } from 'material-ui/styles/colors';
import _ from '../constants/lodash';
import navigateTo from '../utils/navigateTo';
import { SECTIONS } from '../constants/routeConfig';

const cardStyle = {
    padding: '0',
    margin: '.5rem',
    float: 'left',
    width: '230px',
};

const headerStyle = {
    padding: '1rem',
    height: 'auto',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const disabledStyle = {
    cursor: 'not-allowed',
};

const textStyle = {
    height: '85px',
    padding: '.5rem 1rem',
};

const actionStyle = {
    textAlign: 'right',
};

class CardLinks extends Component {
    renderActionButtons(card, canList, canCreate) {
        const actionButtons = [];
        const createPath = `${card.path}/new`;

        if (canCreate) {
            actionButtons.push(
                <IconButton
                    key="add"
                    iconClassName="material-icons"
                    tooltip={i18n.t('Add')}
                    tooltipPosition="top-center"
                    onClick={() => navigateTo(createPath)}
                >
                    &#xE145;
                </IconButton>
            );
        }

        if (canList) {
            actionButtons.push(
                <IconButton
                    key="list"
                    iconClassName="material-icons"
                    tooltip={i18n.t('list')}
                    tooltipPosition="top-center"
                    onClick={() => navigateTo(card.path)}
                >
                    &#xE8EF;
                </IconButton>
            );
        }

        return actionButtons;
    }

    renderCard = (card, index) => {
        const { currentUser, models } = this.context.d2;
        // Based on input from Lars:
        // "you should hide menu items for which the user has no "add" or "delete" authority"
        const canCreate = currentUser.canCreate(models[card.entityType]);
        const canDelete = currentUser.canDelete(models[card.entityType]);
        const canList = canCreate || canDelete;
        const onHeaderClick = canList ? () => navigateTo(card.path) : _.noop;
        const addStyle = canList ? {} : disabledStyle;

        return (
            <Card key={`card-${index}`} style={{ ...cardStyle, ...addStyle }}>
                <CardHeader
                    onClick={onHeaderClick}
                    style={{ ...headerStyle, ...addStyle }}
                    title={card.label}
                    titleColor={canList ? 'inherit' : grey600}
                />
                <CardText style={textStyle} color={canList ? 'inherit' : grey600}>
                    {card.description}
                </CardText>
                <CardActions style={actionStyle}>
                    {this.renderActionButtons(card, canList, canCreate)}
                </CardActions>
            </Card>
        );
    };

    render() {
        return SECTIONS.map(this.renderCard);
    }
}

CardLinks.contextTypes = {
    d2: PropTypes.object,
};

export default CardLinks;
