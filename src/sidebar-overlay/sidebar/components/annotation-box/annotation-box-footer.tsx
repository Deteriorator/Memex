import * as React from 'react'

import { Footer } from '../../../components'
import AnnotationBoxDefaultFooter from './annotation-box-default-footer'

const styles = require('./annotation-box-footer.css')

interface Props {
    mode: 'default' | 'edit' | 'delete'
    handleEditAnnotation: () => void
    handleDeleteAnnotation: () => void
    handleCancelEdit: () => void
    handleCancelDeletion: () => void
    editIconClickHandler: () => void
    trashIconClickHandler: () => void
    shareIconClickHandler: () => void
    replyIconClickHandler: () => void
}

/* tslint:disable-next-line variable-name */
const AnnotationBoxFooter = (props: Props) => (
    <div className={styles.annotationBoxFooter}>
        {props.mode === 'edit' ? (
            <Footer
                actionBtnClassName={styles.footerBoldText}
                actionBtnClickHandler={props.handleEditAnnotation}
                actionBtnText="Save"
                cancelBtnClassName={styles.footerText}
                cancelBtnClickHandler={props.handleCancelEdit}
            />
        ) : props.mode === 'delete' ? (
            <Footer
                actionBtnClassName={styles.footerBoldText}
                actionBtnClickHandler={props.handleDeleteAnnotation}
                actionBtnText="Delete"
                cancelBtnClassName={styles.footerText}
                cancelBtnClickHandler={props.handleCancelDeletion}
                dialogText="Really?"
                dialogTextClassName={styles.deleteReally}
            />
        ) : (
            <AnnotationBoxDefaultFooter
                editIconClickHandler={props.editIconClickHandler}
                trashIconClickHandler={props.trashIconClickHandler}
                shareIconClickHandler={props.shareIconClickHandler}
                replyIconClickHandler={props.replyIconClickHandler}
            />
        )}
    </div>
)

export default AnnotationBoxFooter
