import { StompService, StompConfig, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export class WebSocketMessagingService {

  private messages: Observable<Message>;
  private stompService: StompService;

  constructor(topic: string) {
    const socketUrl: string = environment.rosetteUrl.replace('https://', 'ws://').replace('http://', 'ws://') + 'websocket-private';

    const stompConfig: StompConfig = {
      url: socketUrl,
      headers: {
        'X-AUTH-TOKEN': localStorage.getItem('accessToken'),
      },
      heartbeat_in: 0,
      heartbeat_out: 20000,
      reconnect_delay: 5000,
      debug: false,
    };

    this.stompService = new StompService(stompConfig);
    this.messages = this.stompService.subscribe(topic);
  }

  public stream(): Observable<Message> {
    return this.messages;
  }

  public send(url: string, message: any) {
    return this.stompService.publish(url, JSON.stringify(message));
  }

  public state(): BehaviorSubject<StompState> {
    return this.stompService.state;
  }

  public disconnect(): void {
    this.stompService.disconnect();
  }
}