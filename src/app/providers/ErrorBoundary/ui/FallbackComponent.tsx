import styles from './index.module.css'
export const FallbackComponent = () => {
    return (
        <div
            className={styles.container}
            role='alert'
        >
            <div className={styles.text}>
                <h1>Ошибка загрузки</h1>
                <p>Приложение выполнилось с ошибкой. Попробуйте перезагрузить страницу, либо повторить запрос позже.</p>
            </div>
            <button onClick={() => window.location.replace('/')}>Вернуться на главную</button>
        </div>
    )
}
