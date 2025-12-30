import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Centralized Event Bus using RxJS for component-to-component communication
 * This allows components to communicate without direct dependencies
 */
class EventBus {
    constructor() {
        // Subject for navigation events (scroll to section, menu clicks)
        this.navigationSubject = new Subject();

        // Subject for form submission events
        this.formSubject = new Subject();

        // Subject for UI state changes (mobile menu, modals, etc.)
        this.uiStateSubject = new Subject();

        // Subject for active section tracking (scroll spy)
        this.activeSectionSubject = new Subject();

        // Subject for course inquiry events
        this.courseInquirySubject = new Subject();

        // Generic subject for custom events
        this.customEventSubject = new Subject();
    }

    /**
     * Emit a navigation event
     * @param {Object} data - Event data (e.g., { section: 'about' })
     */
    emitNavigation(data) {
        this.navigationSubject.next(data);
    }

    /**
     * Subscribe to navigation events
     * @returns {Observable}
     */
    onNavigation() {
        return this.navigationSubject.asObservable();
    }

    /**
     * Emit a form submission event
     * @param {Object} data - Form data
     */
    emitFormSubmit(data) {
        this.formSubject.next(data);
    }

    /**
     * Subscribe to form submission events
     * @returns {Observable}
     */
    onFormSubmit() {
        return this.formSubject.asObservable();
    }

    /**
     * Emit UI state change event
     * @param {Object} data - UI state data (e.g., { mobileMenuOpen: true })
     */
    emitUIState(data) {
        this.uiStateSubject.next(data);
    }

    /**
     * Subscribe to UI state changes
     * @returns {Observable}
     */
    onUIState() {
        return this.uiStateSubject.asObservable();
    }

    /**
     * Emit active section change
     * @param {Object} data - Active section data (e.g., { section: 'courses' })
     */
    emitActiveSection(data) {
        this.activeSectionSubject.next(data);
    }

    /**
     * Subscribe to active section changes
     * @returns {Observable}
     */
    onActiveSection() {
        return this.activeSectionSubject.asObservable();
    }

    /**
     * Emit course inquiry event
     * @param {Object} data - Course inquiry data
     */
    emitCourseInquiry(data) {
        this.courseInquirySubject.next(data);
    }

    /**
     * Subscribe to course inquiry events
     * @returns {Observable}
     */
    onCourseInquiry() {
        return this.courseInquirySubject.asObservable();
    }

    /**
     * Emit a custom event
     * @param {string} eventName - Name of the event
     * @param {*} data - Event data
     */
    emit(eventName, data) {
        this.customEventSubject.next({ eventName, data });
    }

    /**
     * Subscribe to custom events
     * @param {string} eventName - Name of the event to listen for
     * @returns {Observable}
     */
    on(eventName) {
        return this.customEventSubject.asObservable().pipe(
            filter(event => event.eventName === eventName),
            map(event => event.data)
        );
    }

    /**
     * Complete all subjects (cleanup)
     */
    destroy() {
        this.navigationSubject.complete();
        this.formSubject.complete();
        this.uiStateSubject.complete();
        this.activeSectionSubject.complete();
        this.courseInquirySubject.complete();
        this.customEventSubject.complete();
    }
}

// Export a singleton instance
const eventBus = new EventBus();
export default eventBus;
