<div class="group">
  <media-time class="time" type="current" />
  <div class="divider">/</div>
  <media-time class="time" type="duration" />
</div>

<style>
  .group {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }

  .time {
    display: inline-block;
    contain: content;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.025em;
  }

  .divider {
    margin: 0 2.5px;
    color: #e0e0e0;
  }
</style>
