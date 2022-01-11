/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
'use strict';

var KISBPM = KISBPM || {};
KISBPM.PROPERTY_CONFIG =
{
    "string": {
        "readModeTemplateUrl": "./properties/default-value-display-template.html",
        "writeModeTemplateUrl": "./properties/string-property-write-mode-template.html"
    },
    "boolean": {
        "templateUrl": "./properties/boolean-property-template.html"
    },
    "text" : {
        "readModeTemplateUrl": "./properties/default-value-display-template.html",
        "writeModeTemplateUrl": "./properties/text-property-write-template.html"
    },
    "kisbpm-multiinstance" : {
        "readModeTemplateUrl": "./properties/default-value-display-template.html",
        "writeModeTemplateUrl": "./properties/multiinstance-property-write-template.html"
    },
    "oryx-formproperties-complex": {
        "readModeTemplateUrl": "./properties/form-properties-display-template.html",
        "writeModeTemplateUrl": "./properties/form-properties-write-template.html"
    },
    "oryx-executionlisteners-multiplecomplex": {
        "readModeTemplateUrl": "./properties/execution-listeners-display-template.html",
        "writeModeTemplateUrl": "./properties/execution-listeners-write-template.html"
    },
    "oryx-tasklisteners-multiplecomplex": {
        "readModeTemplateUrl": "./properties/task-listeners-display-template.html",
        "writeModeTemplateUrl": "./properties/task-listeners-write-template.html"
    },
    "oryx-eventlisteners-multiplecomplex": {
        "readModeTemplateUrl": "./properties/event-listeners-display-template.html",
        "writeModeTemplateUrl": "./properties/event-listeners-write-template.html"
    },
    "oryx-usertaskassignment-complex": {
        "readModeTemplateUrl": "./properties/assignment-display-template.html",
        "writeModeTemplateUrl": "./properties/assignment-write-template.html"
    },
    "oryx-servicetaskfields-complex": {
        "readModeTemplateUrl": "./properties/fields-display-template.html",
        "writeModeTemplateUrl": "./properties/fields-write-template.html"
    },
    "oryx-callactivityinparameters-complex": {
        "readModeTemplateUrl": "./properties/in-parameters-display-template.html",
        "writeModeTemplateUrl": "./properties/in-parameters-write-template.html"
    },
    "oryx-callactivityoutparameters-complex": {
        "readModeTemplateUrl": "./properties/out-parameters-display-template.html",
        "writeModeTemplateUrl": "./properties/out-parameters-write-template.html"
    },
    "oryx-subprocessreference-complex": {
        "readModeTemplateUrl": "./properties/subprocess-reference-display-template.html",
        "writeModeTemplateUrl": "./properties/subprocess-reference-write-template.html"
    },
    "oryx-sequencefloworder-complex" : {
        "readModeTemplateUrl": "./properties/sequenceflow-order-display-template.html",
        "writeModeTemplateUrl": "./properties/sequenceflow-order-write-template.html"
    },
    "oryx-conditionsequenceflow-complex" : {
        "readModeTemplateUrl": "./properties/condition-expression-display-template.html",
        "writeModeTemplateUrl": "./properties/condition-expression-write-template.html"
    },
    "oryx-signaldefinitions-multiplecomplex" : {
        "readModeTemplateUrl": "./properties/signal-definitions-display-template.html",
        "writeModeTemplateUrl": "./properties/signal-definitions-write-template.html"
    },
    "oryx-signalref-string" : {
        "readModeTemplateUrl": "./properties/default-value-display-template.html",
        "writeModeTemplateUrl": "./properties/signal-property-write-template.html"
    },
    "oryx-messagedefinitions-multiplecomplex" : {
        "readModeTemplateUrl": "./properties/message-definitions-display-template.html",
        "writeModeTemplateUrl": "./properties/message-definitions-write-template.html"
    },
    "oryx-messageref-string" : {
        "readModeTemplateUrl": "./properties/default-value-display-template.html",
        "writeModeTemplateUrl": "./properties/message-property-write-template.html"
    }
};
