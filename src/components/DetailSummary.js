import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import _ from '../constants/lodash';
import i18next from 'i18next';
import { parseDateFromUTCString } from '../utils';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import ErrorMessage from './ErrorMessage';
import Heading from 'd2-ui/lib/headings/Heading.component';
import IconLink from './IconLink';
import RaisedButton from 'material-ui/RaisedButton';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import { Link } from 'react-router-dom';

const styles = {
    main: {
        width: '100%',
    },
    heading: {
        paddingBottom: '1rem',
    },
    raisedButton: {
        height: '36px',
        transform: 'translateY(10px)',
        float: 'right',
    },
    paper: {
        padding: '1.4rem',
    },
    cell: {
        fontSize: '1rem',
        padding: '0.8rem',
        verticalAlign: 'top',
    },
    valueCell: {
        textAlign: 'right',
        color: '#757575',
    },
};

const renderPropertyFields = (summaryObject, config) => {
    const labelCellStyle = { ...styles.cell, ...styles.valueCell };
    return config.map((field, index) => {
        let {
            key,
            label,
            removeText,
            parseDate,
            nestedPropselector,
            parseArrayAsCommaDelimitedString,
            count,
        } = field;
        label = i18next.t(label);
        let value = summaryObject[key];

        if (typeof value === 'undefined') {
            value = '';
        } else {
            if (nestedPropselector) {
                nestedPropselector.forEach(selector => {
                    value = value[selector];
                });
            }

            if (parseArrayAsCommaDelimitedString) {
                // Some nested lists come through as a modelCollection but others are already arrays
                if (typeof value.toArray === 'function') {
                    value = value.toArray();
                }
                value = value
                    .map(item => item[parseArrayAsCommaDelimitedString])
                    .join(', ');
            }

            if (removeText) {
                value = _.capitalize(value.replace(removeText, ''));
            }

            if (parseDate && typeof value === 'string') {
                value = parseDateFromUTCString(value);
            }

            if (count) {
                if (typeof value.size === 'number') {
                    value = value.size;
                } else if (typeof value.length === 'number') {
                    value = value.length;
                }
            }
        }

        return (
            <tr key={index}>
                <td style={labelCellStyle}>{label}</td>
                <td style={styles.cell}>{value}</td>
            </tr>
        );
    });
};

const DetailSummary = ({ summaryObject, config, baseName }) => {
    if (summaryObject === null) {
        return <LoadingMask />;
    }

    if (typeof summaryObject === 'string') {
        const errorText = i18next.t(`There was an error fetching the ${baseName}`);
        return <ErrorMessage introText={errorText} errorMessage={summaryObject} />;
    }

    const { id, displayName } = summaryObject;
    const plural = `${baseName}s`,
        baseRoute = `/${_.kebabCase(plural)}`,
        backTooltip = i18next.t(`Back to ${plural}`),
        editLink = `${baseRoute}/edit/${id}`,
        editTooltip = i18next.t(`Edit ${baseName}`);

    return (
        <main style={styles.main}>
            <Heading style={styles.heading}>
                <IconLink to={baseRoute} tooltip={backTooltip} icon="arrow_back" />
                {displayName}
                <RaisedButton
                    style={styles.raisedButton}
                    label={editTooltip}
                    primary={true}
                    containerElement={<Link to={editLink} />}
                    icon={<ImageEdit />}
                />
            </Heading>
            <Paper style={styles.paper}>
                <table>
                    <tbody>{renderPropertyFields(summaryObject, config)}</tbody>
                </table>
            </Paper>
        </main>
    );
};

DetailSummary.propTypes = {
    summaryObject: PropTypes.object,
    config: PropTypes.array.isRequired,
    baseName: PropTypes.string.isRequired,
};

export default DetailSummary;
