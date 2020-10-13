import i18n from '@dhis2/d2-i18n'

const createNameLookup = () => {
    return new Map([
        ['ALL', i18n.t('All (Full authority)')],
        ['F_ANALYTICSTABLEHOOK', i18n.t('Analytics Table Hook')],
        ['F_ATTRIBUTE', i18n.t('Attribute')],
        ['F_CATEGORY_COMBO', i18n.t('Category Combo')],
        ['F_CATEGORY', i18n.t('Category')],
        ['F_CATEGORY_OPTION', i18n.t('Category Option')],
        ['F_CATEGORY_OPTION_GROUP', i18n.t('Category Option Group')],
        ['F_CATEGORY_OPTION_GROUP_SET', i18n.t('Category Option Group Set')],
        ['F_COLOR_SET', i18n.t('Color Set')],
        ['F_CONSTANT', i18n.t('Constant')],
        ['F_DASHBOARD', i18n.t('Dashboard')],
        ['F_DATAELEMENTGROUPSET', i18n.t('Data Element Group Sets')],
        ['F_DATAELEMENTGROUP', i18n.t('Data Element Groups')],
        ['F_DATAELEMENT', i18n.t('Data Element')],
        ['F_DATAELEMENT_MINMAX', i18n.t('Min/max rule')],
        ['F_DATASET', i18n.t('Data Set')],
        ['F_DATAVALUE', i18n.t('Data Value')],
        ['F_DOCUMENT', i18n.t('Document')],
        ['F_EVENTCHART', i18n.t('Event Chart')],
        ['F_EVENTREPORT', i18n.t('Event Report')],
        ['F_EXTERNAL_MAP_LAYER', i18n.t('External Map Layer')],
        ['F_INDICATORGROUPSET', i18n.t('Indicator Group Sets')],
        ['F_INDICATORGROUP', i18n.t('Indicator Group')],
        ['F_INDICATORTYPE', i18n.t('Indicator Type')],
        ['F_INDICATOR', i18n.t('Indicator')],
        ['F_LEGEND_SET', i18n.t('Legend Set')],
        ['F_MAP', i18n.t('Map')],
        ['F_MINMAX_DATAELEMENT', i18n.t('Min-Max Data Element')],
        ['F_OPTIONGROUPSET', i18n.t('Option Group Set')],
        ['F_OPTIONGROUP', i18n.t('Option Group')],
        ['F_OPTIONSET', i18n.t('Option Set')],
        ['F_ORGANISATIONUNIT', i18n.t('Organisation Unit')],
        ['F_ORGUNITGROUPSET', i18n.t('Organisation Unit Group Set')],
        ['F_ORGUNITGROUP', i18n.t('Organisation Unit Group')],
        ['F_PREDICTOR', i18n.t('Predictor')],
        ['F_PROGRAMSTAGE', i18n.t('Program Stage')],
        ['F_PROGRAM', i18n.t('Program')],
        ['F_PROGRAM_INDICATOR', i18n.t('Program Indicator')],
        ['F_PROGRAM_INDICATOR_GROUP', i18n.t('Program Indicator Group')],
        ['F_PROGRAM_RULE', i18n.t('Program Rule')],
        [
            'F_PROGRAM_TRACKED_ENTITY_ATTRIBUTE_GROUP',
            i18n.t('Program Tracked Entity Attribute Group'),
        ],
        ['F_PUSH_ANALYSIS', i18n.t('Push Analysis')],
        ['F_RELATIONSHIPTYPE', i18n.t('Relationship Type')],
        ['F_REPORT', i18n.t('Report')],
        ['F_SECTION', i18n.t('Section')],
        ['F_SQLVIEW', i18n.t('SQL View')],
        ['F_TRACKED_ENTITY', i18n.t('Tracked Entity')],
        ['F_TRACKED_ENTITY_ATTRIBUTE', i18n.t('Tracked Entity Attribute')],
        ['F_TRACKED_ENTITY_DATAVALUE', i18n.t('Tracked Entity Data Value')],
        ['F_TRACKED_ENTITY_INSTANCE', i18n.t('Tracked Entity Instance')],
        ['F_USERGROUP', i18n.t('User Group')],
        ['F_USERROLE', i18n.t('User Role')],
        ['F_USER', i18n.t('User')],
        ['F_VALIDATIONRULEGROUP', i18n.t('Validation Rule Group')],
        ['F_VALIDATIONRULE', i18n.t('Validation Rule')],
        ['F_PREDICTORGROUP', i18n.t('Data predictor group')],
        ['F_SKIP_DATA_IMPORT_AUDIT', i18n.t('Skip data import audit')],
        ['F_VISUALIZATION', i18n.t('Visualization')],
        ['F_APPROVAL_VALIDATIONRULE', i18n.t('Approval Validation Rule')],
        [
            'F_DATAELEMENTS_BY_ORGANISATIONUNIT',
            i18n.t('Data Elements By Organisation Unit'),
        ],
    ])
}

// returns cached results after first call
export default (() => {
    let map = null
    return () => {
        if (!map) {
            map = createNameLookup()
        }
        return map
    }
})()
