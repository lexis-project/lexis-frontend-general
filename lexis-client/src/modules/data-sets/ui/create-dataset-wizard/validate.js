import { checkFineWritePerms } from "../../../auth/auth-check-fine-perms"

export function validateDSCreateForm(values) {
    const errors = {metadata:{}}
    const metadata = values && values.metadata
    if(!metadata || !metadata.title || metadata.title.length < 2 ) {
        errors.metadata.title = 'Required, should be longer then two letters'
    }
    if(!values || !values.project ) {
        errors.project = 'Required'
    }
    if(!values || !values.access ) {
        errors.access = 'Required'
    }

    if(values && values.access === 'public'
  && (!metadata || !metadata.rightsURI || metadata.rightsURI.length === 0 || !(!!metadata.rightsURI[0] && metadata.rightsURI[0].length !== 0)) ) {
        errors.metadata.rightsURI = ['Required']
    }
    if(!values || !values.zone ) {
        errors.zone = 'Required'
    }

    return errors
}

export const validateDSCreateFormRightsURI = (value, allValues) => {
    if(allValues && allValues.access === 'public'
  && (!value
    ||( value && value.length === 0 )|| !value[0] ||value[0].length === 0)) {
        return 'Should\'nt be empty when uploading public dataset'
    }
    return null
}

export function validateDSUploadFragment(values) {
    const errors = {savedFile:{}}
    const savedFile = values && values.savedFile

    if(!savedFile || !savedFile.uploadType) {
        errors.savedFile.uploadType = 'Required'
    }
    if(!savedFile || !savedFile.fileType) {
        errors.savedFile.fileType = 'Required'
    }

    return errors
}

/**
 * 
 * @param {{savedFile:{}}} valuesUploadFrag 
 * @param {{metadata:{}}} valuesCreateWiz 
 * @returns {Boolean}
 */
export function customValidationWrapper(valuesUploadFrag, valuesCreateWiz) { // custom checking validity, because redux-form syncValidator doesnt work as expected
    let fragValidity = validateDSUploadFragment(valuesUploadFrag) // valid when true
    let createWizValidity = validateDSCreateForm(valuesCreateWiz) // valid when true

    fragValidity = Object.keys(fragValidity).length === 1 && Object.keys(fragValidity.savedFile).length === 0
    createWizValidity = Object.keys(createWizValidity).length === 1 && Object.keys(createWizValidity.metadata).length === 0

    return fragValidity && createWizValidity
}

export function isFirstPageInvalid(isDsToUploadFormValid, isDSBasicInfoValid, formDsBasicInfo, perms){
    return !isDsToUploadFormValid 
    || !isDSBasicInfoValid 
    || !(formDsBasicInfo && formDsBasicInfo.project && formDsBasicInfo.access 
        && (formDsBasicInfo.access === 'public' ? checkFineWritePerms(formDsBasicInfo.project, 'dat_pub_short', perms) : true))
}