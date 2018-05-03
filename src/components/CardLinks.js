import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import IconButton from 'material-ui/IconButton/IconButton';
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

        if (!canList) {
            return null;
        }

        return (
            <Card key={`card-${index}`} style={cardStyle}>
                <CardHeader
                    onClick={() => navigateTo(card.path)}
                    style={headerStyle}
                    title={card.label}
                />
                <CardText style={textStyle}>{card.description}</CardText>
                <CardActions style={actionStyle}>
                    {this.renderActionButtons(card, canList, canCreate)}
                </CardActions>
            </Card>
        );
    };

    render() {
        const cards = SECTIONS.map(this.renderCard);

        if (cards.length === 0) {
            return (
                <div>
                    {i18n.t(
                        'You do not have access to any section of the DHIS 2 User Management App'
                    )}
                </div>
            );
        }

        return cards;
    }
}

CardLinks.contextTypes = {
    d2: PropTypes.object,
};

export default CardLinks;
