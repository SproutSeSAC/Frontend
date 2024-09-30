export default function EditorModule() {
  return (
    <div>
      <div className="ql-formats">
        <select className="ql-size" defaultValue="medium">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
      </div>
      <div className="ql-formats">
        <button type="button" aria-label="ql-bold" className="ql-bold" />
        <button type="button" aria-label="ql-italic" className="ql-italic" />
        <button
          type="button"
          aria-label="ql-underline"
          className="ql-underline"
        />
        <button type="button" aria-label="ql-strike" className="ql-strike" />
      </div>
      <div className="ql-formats">
        <button
          type="button"
          aria-label="ql-list"
          className="ql-list"
          value="ordered"
        />
        <button
          type="button"
          aria-label="ql-list"
          className="ql-list"
          value="bullet"
        />
        <button
          type="button"
          aria-label="ql-indent"
          className="ql-indent"
          value="-1"
        />
        <button
          type="button"
          aria-label="ql-indent"
          className="ql-indent"
          value="+1"
        />
      </div>
      <div className="ql-formats">
        <select aria-label="ql-color" className="ql-color" />
        <select aria-label="ql-background" className="ql-background" />
        <select aria-label="ql-align" className="ql-align" />
      </div>
      <div className="ql-formats">
        <button type="button" aria-label="ql-link" className="ql-link" />
        <button
          type="button"
          aria-label="ql-code-block"
          className="ql-code-block"
        />
      </div>
    </div>
  );
}
