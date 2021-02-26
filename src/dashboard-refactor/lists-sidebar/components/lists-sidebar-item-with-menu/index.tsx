import React, { PureComponent } from 'react'
import styled, { css, keyframes } from 'styled-components'

import styles, { fonts } from 'src/dashboard-refactor/styles'
import colors from 'src/dashboard-refactor/colors'

import { Icon } from 'src/dashboard-refactor/styled-components'
import Margin from 'src/dashboard-refactor/components/Margin'
import {
    ListSource,
    DropReceivingState,
    SelectedState,
} from 'src/dashboard-refactor/types'
import ListsSidebarEditableItem, {
    Props as EditableItemProps,
} from '../lists-sidebar-editable-item'
import { ListNameHighlightIndices } from '../../types'
import * as icons from 'src/common-ui/components/design-library/icons'

export interface Props {
    className?: string
    isEditing?: boolean
    newItemsCount?: number
    name: string
    listId: number
    source?: ListSource
    hasActivity?: boolean
    isMenuDisplayed?: boolean
    nameHighlightIndices?: ListNameHighlightIndices
    onUnfollowClick?: React.MouseEventHandler
    onRenameClick?: React.MouseEventHandler
    onDeleteClick?: React.MouseEventHandler
    onShareClick?: React.MouseEventHandler
    dropReceivingState?: DropReceivingState
    editableProps?: EditableItemProps
    selectedState: SelectedState
    onMoreActionClick?: (listId: number) => void
}

export default class ListsSidebarItemWithMenu extends PureComponent<Props> {
    private handleSelection: React.MouseEventHandler = (e) =>
        this.props.selectedState.onSelection(this.props.listId)

    private handleMoreActionClick: React.MouseEventHandler = (e) => {
        e.stopPropagation()
        this.props.onMoreActionClick(this.props.listId)
    }

    private handleDrop: React.DragEventHandler = (e) => {
        e.preventDefault()
        this.props.dropReceivingState?.onDrop(this.props.listId, e.dataTransfer)
    }

    private renderMenuBtns() {
        if (!this.props.source) {
            return false
        }

        if (this.props.source === 'followed-list') {
            return (
                <MenuButton onClick={this.props.onUnfollowClick}>
                    <Margin horizontal="10px">
                        <Icon heightAndWidth="12px" path={'TODO.svg'} />
                    </Margin>
                    Unfollow
                </MenuButton>
            )
        }

        return (
            <>
                <MenuButton onClick={this.props.onShareClick}>
                    <Margin horizontal="10px">
                        <Icon heightAndWidth="12px" path={icons.share} />
                    </Margin>
                    Share
                </MenuButton>
                <MenuButton onClick={this.props.onDeleteClick}>
                    <Margin horizontal="10px">
                        <Icon heightAndWidth="12px" path={icons.remove} />
                    </Margin>
                    Delete
                </MenuButton>
                <MenuButton onClick={this.props.onRenameClick}>
                    <Margin horizontal="10px">
                        <Icon heightAndWidth="12px" path={icons.edit} />
                    </Margin>
                    Rename
                </MenuButton>
            </>
        )
    }

    private renderIcon() {
        const {
            dropReceivingState,
            onMoreActionClick,
            newItemsCount,
            hasActivity,
        } = this.props

        if (hasActivity) {
            return <ActivityBeacon />
        }

        if (newItemsCount) {
            return (
                <NewItemsCount>
                    <NewItemsCountInnerDiv>
                        {newItemsCount}
                    </NewItemsCountInnerDiv>
                </NewItemsCount>
            )
        }

        if (dropReceivingState?.isDraggedOver) {
            return <Icon heightAndWidth="12px" path="/img/plus.svg" />
        }

        if (onMoreActionClick) {
            return <Icon heightAndWidth="12px" path="/img/3dots.svg" />
        }
    }

    private renderTitle() {
        if (!this.props.nameHighlightIndices) {
            return (
                <ListTitle selectedState={this.props.selectedState}>
                    {this.props.name}
                </ListTitle>
            )
        }

        const [from, to] = this.props.nameHighlightIndices
        const [namePre, nameHighlighted, namePost] = [
            this.props.name.slice(0, from),
            this.props.name.slice(from, to),
            this.props.name.slice(to),
        ]

        return (
            <ListTitle selectedState={this.props.selectedState}>
                {namePre.length > 0 && <span>{namePre}</span>}
                <span style={{ fontWeight: fonts.primary.weight.bold }}>
                    {nameHighlighted}
                </span>
                {namePost.length > 0 && <span>{namePost}</span>}
            </ListTitle>
        )
    }

    render() {
        const {
            selectedState,
            dropReceivingState,
            onMoreActionClick,
            isMenuDisplayed,
            isEditing,
            listId,
            ...props
        } = this.props

        if (isEditing) {
            return <ListsSidebarEditableItem {...this.props.editableProps} />
        }

        return (
            <Container>
                <SidebarItem
                    {...props}
                    isMenuDisplayed={isMenuDisplayed}
                    onDragEnter={dropReceivingState?.onDragEnter}
                    onDragLeave={dropReceivingState?.onDragLeave}
                    onDrop={this.handleDrop}
                >
                    <TitleBox onClick={this.handleSelection}>
                        {' '}
                        {this.renderTitle()}
                    </TitleBox>
                    <IconBox onClick={this.handleMoreActionClick} {...props}>
                        {this.renderIcon()}
                    </IconBox>
                </SidebarItem>
                <MenuContainer isDisplayed={isMenuDisplayed}>
                    {this.renderMenuBtns()}
                </MenuContainer>
            </Container>
        )
    }
}

const Container = styled.div`
    position: relative;
`

const MenuContainer = styled.div`
    width: min-content;
    position: absolute;
    left: 200px;
    top: 0px;
    background-color: ${colors.white};
    box-shadow: ${styles.boxShadow.overlayElement};
    border-radius: ${styles.boxShadow.overlayElement};
    ${(props) =>
        css`
            display: ${props.isDisplayed
                ? `flex; flex-direction: column`
                : `none`};
        `};
`

const IconBox = styled.div<Props>`
    display: ${(props) =>
        !props.hasActivity && !props.newItemsCount ? 'none' : 'flex'};
    height: 100%;
    align-items: center;
    padding-right: 10px;
    width: 30px;
    justify-content: flex-end;
`

const SidebarItem = styled.div<Props>`
    height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;

    &:hover {
        background-color: ${colors.onHover};
    }

    ${(props) =>
        css`
            background-color: ${props.isMenuDisplayed
                ? `${colors.onHover}`
                : `transparent`};
        `};


    &:hover ${IconBox} {
            display: flex;
      }

    ${({ selectedState }: Props) =>
        selectedState?.isSelected &&
        css`
            background-color: ${colors.onSelect};
        `}

    ${({ dropReceivingState }: Props) =>
        dropReceivingState?.triggerSuccessfulDropAnimation &&
        css`
            animation: ${blinkingAnimation} 0.4s 2;
        `}

    cursor: ${({ dropReceivingState }: Props) =>
        !dropReceivingState?.isDraggedOver
            ? `pointer`
            : dropReceivingState?.canReceiveDroppedItems
            ? `default`
            : `not-allowed`};
`

const MenuButton = styled.div`
    height: 34px;
    width: 100%;
    font-family: ${fonts.primary.name};
    font-weight: ${fonts.primary.weight.normal};
    font-size: 12px;
    line-height: 18px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    padding: 0px 10px 0 0;

    &: ${SidebarItem} {
        background-color: red;
    }

    &:hover {
        background-color: ${colors.onHover};
    }

    & > div {
        width: auto;
    }
`

const TitleBox = styled.div`
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    padding-left: 15px;
    align-items: center;
`

const ListTitle = styled.p<Props>`
    margin: 0;
    font-family: ${fonts.primary.name};
    font-style: normal;
    ${({ selectedState }: Props) =>
        selectedState.isSelected &&
        `font-weight: ${fonts.primary.weight.bold};`}
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    max-width: 100%;
`

const ActivityBeacon = styled.div`
    width: 14px;
    height: 14px;
    margin-right: 1em;
    border-radius: 10px;
    padding: 8px;
    background-color: #5cd9a6;
`

const NewItemsCount = styled.div`
    width: 30px;
    height: 14px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.midGrey};
`

const NewItemsCountInnerDiv = styled.div`
    font-family: ${fonts.primary.name};
    font-weight: ${fonts.primary.weight.bold};
    font-size: 10px;
    line-height: 14px;
`

// probably want to use timing function to get this really looking good. This is just quick and dirty
const blinkingAnimation = keyframes`
    0% {
        background-color: ${colors.onHover};
    }
    70% {
        background-color: transparent;
    }
    100% {
        background-color: ${colors.onHover};
    }
`
