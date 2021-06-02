import React from 'react'
import {createUseStyles} from 'react-jss'


export const deepLinkingStyles = createUseStyles({
    tool: {
        width: '100%',
        float: 'left'
    },
    toolContainer: {
        width: '100%',
        float: 'inherit'
    },
    contentTypesContainer: {
        width: '50%',
        float: 'inherit'
    },
    contentTypeContainer: {
        float: 'inherit',
        border: 'none',
        width: '100%'
    },
    contentTypeInputGroup: {
        float: 'left',
        width: '80%'
    },
    contentTypeName: {
        width: '40%',
        float: 'inherit'
    },

    payloadsContainer: {
        width: '40%',
        float: 'inherit'
    },

    payloadViewer: {
        float: 'inherit'
    },
    jsonViewer:{
       'text-align': 'left'
    }
})