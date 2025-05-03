import { IEvents } from "../base/events";

export interface IModal {
    open(): void;
    close(): void;
    render(): HTMLElement
}

export class ModalInterface implements IModal {
    protected modalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected modalContent: HTMLElement;
    protected pageWrapper: HTMLElement;
    
    constructor(modalContainer: HTMLElement, protected events: IEvents) {
        this.modalElement = modalContainer;
        this.closeButton = modalContainer.querySelector('.modal__close');
        this.modalContent = modalContainer.querySelector('.modal__content');
        this.pageWrapper = document.querySelector('.page__wrapper');

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.modalElement.addEventListener('click', this.close.bind(this));
        this.modalElement.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this.modalContent.replaceChildren(value);
    }

    open() {
        this.modalElement.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.modalElement.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    set isLocked(value: boolean) {
        if (value) {
            this.pageWrapper.classList.add('page__wrapper_locked');
        } else {
            this.pageWrapper.classList.remove('page__wrapper_locked');
        }
    }

    render(): HTMLElement {
        this.modalContent;
        this.open();
        return this.modalElement
    }
}