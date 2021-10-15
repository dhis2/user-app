import { colors } from '@dhis2/ui-constants'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { InputPrefix } from '../select/index.js'

const Input = ({ dataTest, prefix, className, inputMaxHeight, value }) => (
    <div className={cx('root', className)}>
        <InputPrefix prefix={prefix} dataTest={`${dataTest}-prefix`} />
        <span>{value}</span>

        <style jsx>{`
            .root {
                display: flex;
                align-items: center;
                color: ${colors.grey900};
                font-size: 14px;
                line-height: 16px;
            }

            .root-input {
                overflow-y: auto;
                flex: 1;
            }
        `}</style>

        <style jsx>{`
            .root-input {
                max-height: ${inputMaxHeight};
            }
        `}</style>
    </div>
)

Input.defaultProps = {
    inputMaxHeight: '100px',
}

Input.propTypes = {
    className: PropTypes.string,
    dataTest: PropTypes.string,
    inputMaxHeight: PropTypes.string,
    prefix: PropTypes.string,
    value: PropTypes.string,
}

export { Input }
